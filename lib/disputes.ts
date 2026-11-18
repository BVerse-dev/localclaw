import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";
import { getPlan, DISCOVERY, usd } from "@/lib/plans";
import { COMPANY, POLICY_VERSION, REFUND_POLICY, REFUND_URL, TERMS, TERMS_URL, policyAsText } from "@/lib/policy";
import { textToPdf } from "@/lib/pdf";

// ═════════════════════════════════════════════════════════════════════════════
// Chargeback defence: when a dispute opens, gather everything we know about the
// purchase and STAGE it as evidence on the dispute (submit: false). A human then
// reviews it in the Stripe Dashboard and clicks Submit before the due date.
// ═════════════════════════════════════════════════════════════════════════════

const iso = (unix?: number | null) => (unix ? new Date(unix * 1000).toISOString() : "");

/** Find the Checkout Session behind a disputed charge (payment intent → customer → email). */
async function findSession(stripe: Stripe, charge: Stripe.Charge): Promise<Stripe.Checkout.Session | null> {
  const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (pi) {
    const byPi = await stripe.checkout.sessions.list({ payment_intent: pi, limit: 1 });
    if (byPi.data[0]) return byPi.data[0];
  }
  const customer = typeof charge.customer === "string" ? charge.customer : charge.customer?.id;
  if (customer) {
    const byCustomer = await stripe.checkout.sessions.list({ customer, status: "complete", limit: 10 });
    const before = byCustomer.data.filter((s) => s.created <= charge.created);
    if (before[0] || byCustomer.data[0]) return before[0] || byCustomer.data[0];
  }
  const email = charge.billing_details?.email || charge.receipt_email;
  if (email) {
    const byEmail = await stripe.checkout.sessions.list({ customer_details: { email }, status: "complete", limit: 10 });
    if (byEmail.data[0]) return byEmail.data[0];
  }
  return null;
}

async function findDelivery(leadId: string | null | undefined, email: string | null | undefined) {
  try {
    const db = getSupabase();
    let lead: Record<string, unknown> | null = null;
    if (leadId) {
      const { data } = await db.from("intake_submissions").select("*").eq("id", leadId).limit(1);
      lead = data?.[0] || null;
    }
    if (!lead && email) {
      const { data } = await db.from("intake_submissions").select("*").eq("email", email.toLowerCase()).order("created_at", { ascending: false }).limit(1);
      lead = data?.[0] || null;
    }
    let agent: Record<string, unknown> | null = null;
    if (lead?.id) {
      const { data } = await db.from("deployed_agents").select("agent_name, slug, plan, status, created_at, updated_at").eq("submission_id", lead.id).limit(1);
      agent = data?.[0] || null;
    }
    return { lead, agent };
  } catch (e) {
    console.error("Dispute evidence: Supabase lookup failed", e);
    return { lead: null, agent: null };
  }
}

async function uploadPdf(stripe: Stripe, name: string, title: string, lines: string[]): Promise<string | undefined> {
  try {
    const file = await stripe.files.create({
      purpose: "dispute_evidence",
      file: { data: textToPdf(title, lines), name, type: "application/pdf" },
    });
    return file.id;
  } catch (e) {
    console.error(`Dispute evidence: upload of ${name} failed`, e);
    return undefined;
  }
}

export interface StagedEvidenceResult {
  staged: boolean;
  summary: string;
  leadId: string | null;
}

export async function stageDisputeEvidence(stripe: Stripe, dispute: Stripe.Dispute): Promise<StagedEvidenceResult> {
  const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge.id;
  const charge = await stripe.charges.retrieve(chargeId);
  const session = await findSession(stripe, charge).catch(() => null);
  const meta = session?.metadata || {};

  const email = (session?.customer_details?.email || charge.billing_details?.email || charge.receipt_email || "").toLowerCase();
  const name = session?.customer_details?.name || charge.billing_details?.name || "";
  const addr = session?.customer_details?.address || charge.billing_details?.address;
  const billingAddress = addr ? [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country].filter(Boolean).join(", ") : "";

  const planKey = meta.plan || "";
  const plan = getPlan(planKey);
  const planLabel = plan
    ? `${plan.name} — ${usd(plan.setup)} one-time setup + ${usd(plan.monthly)}/month managed AI agent service`
    : planKey === "discovery" ? `${DISCOVERY.name} — ${usd(DISCOVERY.amount)} scoping call deposit for AI agent deployment` : "LocalClaw AI agent deployment and management services";

  const tosConsent = session?.consent?.terms_of_service === "accepted";
  const { lead, agent } = await findDelivery(meta.lead_id || session?.client_reference_id, email);
  const leadId = (lead?.id as string) || null;

  const acceptance = [
    `Terms version: ${meta.terms_version || POLICY_VERSION}`,
    meta.terms_accepted_at ? `Accepted on intake form: ${meta.terms_accepted_at}` : "",
    meta.terms_accepted_ip ? `From IP address: ${meta.terms_accepted_ip}` : "",
    meta.terms_accepted_ua ? `Browser: ${meta.terms_accepted_ua}` : "",
    tosConsent ? "Stripe Checkout recorded the customer ticking the Terms of Service checkbox before paying." : "",
    "Non-refundable notice displayed on: pricing page, intake form (required checkbox), and the Stripe Checkout payment button.",
  ].filter(Boolean);

  const purchase = [
    `Customer: ${name} <${email}>`,
    billingAddress ? `Billing address: ${billingAddress}` : "",
    `Purchased: ${planLabel}`,
    `Charge: ${chargeId} — ${usd(charge.amount / 100)} on ${iso(charge.created)}`,
    session ? `Checkout session: ${session.id} completed ${iso(session.created)}` : "",
    charge.payment_method_details?.card?.three_d_secure ? `3D Secure: ${charge.payment_method_details.card.three_d_secure.result || "attempted"}` : "",
    charge.outcome?.risk_level ? `Stripe Radar risk level: ${charge.outcome.risk_level}` : "",
  ].filter(Boolean);

  const delivery = [
    lead ? `Intake form submitted ${String(lead.created_at || "")} for business "${String(lead.business || "")}" (status: ${String(lead.status || "")}).` : "",
    lead?.details ? `Intake record: ${String(lead.details).slice(0, 600)}` : "",
    agent ? `AI agent "${String(agent.agent_name)}" (${String(agent.slug)}) configured ${String(agent.created_at)}; current status ${String(agent.status)}; last updated ${String(agent.updated_at)}.` : "",
  ].filter(Boolean);

  const refundExplanation =
    `The customer purchased a professional service and agreed, before paying, that all payments are final and non-refundable (${REFUND_URL}). ` +
    `Work began immediately after payment: capacity was reserved, infrastructure provisioned and AI agents configured. ` +
    `Our policy offers remediation of any in-scope issue at no cost instead of refunds; ${COMPANY.brand} has no record of the customer requesting help or cancellation before this dispute.`;

  const [refundPolicyFile, servicePdf] = await Promise.all([
    uploadPdf(stripe, "refund-policy.pdf", `${COMPANY.brand} Refund & Cancellation Policy (v${POLICY_VERSION}) — ${REFUND_URL}`, [
      ...policyAsText(REFUND_POLICY), "", `Terms of Service (${TERMS_URL}):`, "", ...policyAsText(TERMS),
    ]),
    uploadPdf(stripe, "purchase-and-service-record.pdf", `${COMPANY.brand} purchase, consent and service record`, [
      "PURCHASE", ...purchase, "", "CUSTOMER ACCEPTANCE OF TERMS", ...acceptance, "", "SERVICE DELIVERY", ...(delivery.length ? delivery : ["See Dashboard notes."]),
    ]),
  ]);

  const evidence: Stripe.DisputeUpdateParams.Evidence = {
    customer_name: name || undefined,
    customer_email_address: email || undefined,
    billing_address: billingAddress || undefined,
    customer_purchase_ip: meta.terms_accepted_ip || undefined,
    product_description: `${planLabel}. Delivered digitally by ${COMPANY.brand} (${COMPANY.legalName}), ${COMPANY.site}.`,
    service_date: (charge.created ? new Date(charge.created * 1000) : new Date()).toISOString().slice(0, 10),
    refund_policy: refundPolicyFile,
    refund_policy_disclosure: `Disclosed before purchase on the pricing page, as a required checkbox on the intake form, and on the Stripe Checkout page. ${acceptance.join(" ")}`.slice(0, 20000),
    refund_refusal_explanation: refundExplanation,
    cancellation_policy: refundPolicyFile,
    cancellation_policy_disclosure: "Monthly plans can be cancelled anytime by email to stop future billing; cancellation terms were shown and accepted before purchase alongside the Refund Policy.",
    cancellation_rebuttal: "The customer did not contact us to cancel before this charge. Cancellation stops future billing only; charges for periods already started are non-refundable per the accepted policy.",
    service_documentation: servicePdf,
    access_activity_log: delivery.join("\n") || undefined,
    uncategorized_text: [...purchase, "", ...acceptance, "", ...delivery].join("\n").slice(0, 20000),
  };

  // Strip undefined so we never blank out evidence already on the dispute
  for (const k of Object.keys(evidence) as (keyof typeof evidence)[]) if (evidence[k] === undefined) delete evidence[k];

  await stripe.disputes.update(dispute.id, { evidence, submit: false, metadata: { evidence_staged_at: new Date().toISOString(), lead_id: leadId || "" } });

  const summary = [
    `Reason: ${dispute.reason} · Amount: ${usd(dispute.amount / 100)} · Respond by: ${iso(dispute.evidence_details?.due_by)}`,
    ...purchase,
    ...acceptance,
    ...delivery,
    `Evidence staged (NOT submitted): refund policy PDF ${refundPolicyFile ? "✓" : "✗"}, service record PDF ${servicePdf ? "✓" : "✗"}.`,
  ].join("\n");

  return { staged: true, summary, leadId };
}
