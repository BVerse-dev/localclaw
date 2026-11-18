import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";
import { planFromAmount, isPlanKey } from "@/lib/plans";
import { sendPurchaseConfirmation, purchaseTypeOf } from "@/lib/emails";
import { stageDisputeEvidence } from "@/lib/disputes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_unset", { apiVersion: "2026-02-25.clover" });

export const runtime = "nodejs";

async function buffer(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

// ── Helper: find lead by email ───────────────────────────────────────────────
async function findLeadByEmail(email: string) {
  if (!email) return null;
  const { data } = await getSupabase()
    .from("intake_submissions")
    .select("id, status, payment_status, stripe_customer_id")
    .eq("email", email.toLowerCase())
    .order("created_at", { ascending: false })
    .limit(1);
  return data?.[0] || null;
}

// ── Helper: find lead by Stripe customer ID ──────────────────────────────────
async function findLeadByCustomer(customerId: string) {
  if (!customerId) return null;
  const { data } = await getSupabase()
    .from("intake_submissions")
    .select("id, status, payment_status, email")
    .eq("stripe_customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1);
  return data?.[0] || null;
}

// ── Helper: log event to payment_events table ────────────────────────────────
async function logEvent(
  eventType: string,
  stripeEventId: string,
  email: string | null,
  leadId: string | null,
  amount: number,
  currency: string,
  status: string,
  failureReason: string | null,
  metadata: Record<string, unknown> = {},
) {
  await getSupabase().from("payment_events").insert({
    event_type: eventType,
    stripe_event_id: stripeEventId,
    email: email?.toLowerCase() || null,
    lead_id: leadId,
    amount,
    currency,
    status,
    failure_reason: failureReason,
    metadata,
  }).then(({ error }) => {
    if (error) console.error("Failed to log payment event:", error);
  });
}

// ── Helper: find lead by our own intake id (client_reference_id / metadata) ─
async function findLeadById(id: string | null | undefined) {
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await getSupabase()
    .from("intake_submissions")
    .select("id, status, payment_status, stripe_customer_id, email")
    .eq("id", id)
    .limit(1);
  return data?.[0] || null;
}

// ── Helper: resolve plan — explicit metadata wins, amount is a fallback ─────
function resolvePlan(metadata: Stripe.Metadata | null | undefined, amountCents: number): string {
  const tagged = metadata?.plan;
  if (tagged === "discovery" || isPlanKey(tagged)) return tagged;
  return planFromAmount(amountCents);
}

// ── Helper: send email alert ─────────────────────────────────────────────────
async function sendAlert(subject: string, body: string) {
  const alertEmail = process.env.ALERT_EMAIL;
  if (!alertEmail || !process.env.RESEND_API_KEY) return;
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "LocalClaw <alerts@mail.localclawagents.com>",
    to: alertEmail,
    subject,
    text: body,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN WEBHOOK HANDLER
// ═════════════════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;

  try {
    const body = await buffer(req.body!);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret || webhookSecret.startsWith("whsec_PASTE")) {
      // Never trust unsigned events — anyone could POST a fake "paid" event.
      console.error("STRIPE_WEBHOOK_SECRET is not configured — rejecting webhook");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency: Stripe retries deliveries — never process (or email) the same event twice
  try {
    const { data: seen } = await getSupabase().from("payment_events").select("id").eq("stripe_event_id", event.id).limit(1);
    if (seen?.length) return NextResponse.json({ received: true, duplicate: true });
  } catch (e) {
    console.error("Idempotency check failed (continuing):", e);
  }

  try {
    switch (event.type) {

      // ══════════════════════════════════════════════════════════════════════
      // CHECKOUT
      // ══════════════════════════════════════════════════════════════════════
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = (session.customer_email || session.customer_details?.email || "").toLowerCase();
        const amount = session.amount_total || 0;
        const currency = session.currency || "usd";
        const customerId = typeof session.customer === "string" ? session.customer : null;
        const plan = resolvePlan(session.metadata, session.amount_subtotal ?? amount); // pre-tax, pre-discount: matches list prices exactly
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

        const lead =
          (await findLeadById(session.client_reference_id || session.metadata?.lead_id)) ||
          (await findLeadByEmail(email));

        if (lead) {
          const updates: Record<string, unknown> = {
            payment_status: "paid",
            payment_amount: amount,
            payment_currency: currency,
            stripe_customer_id: customerId,
            stripe_session_id: session.id,
            stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
            paid_at: new Date().toISOString(),
            last_payment_at: new Date().toISOString(),
            plan,
            updated_at: new Date().toISOString(),
          };
          if (subscriptionId) updates.subscription_id = subscriptionId;
          if (["new", "contacted"].includes(lead.status)) updates.status = "onboarded";

          await getSupabase().from("intake_submissions").update(updates).eq("id", lead.id);
          console.log(`✅ Lead ${lead.id} → paid (${plan})`);
        } else if (email) {
          await getSupabase().from("intake_submissions").insert({
            name: session.customer_details?.name || "Stripe Customer",
            email,
            business: "—",
            status: "onboarded",
            payment_status: "paid",
            payment_amount: amount,
            payment_currency: currency,
            stripe_customer_id: customerId,
            stripe_session_id: session.id,
            stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
            paid_at: new Date().toISOString(),
            last_payment_at: new Date().toISOString(),
            plan,
            ...(subscriptionId ? { subscription_id: subscriptionId } : {}),
          });
          console.log(`✅ New lead from payment: ${email}`);
        }

        const purchaseType = purchaseTypeOf({ planKey: plan, mode: session.mode, subtotalCents: session.amount_subtotal || amount });

        // Customer confirmation with the billing policy restated (chargeback prevention + evidence)
        const confirmationSent = await sendPurchaseConfirmation({
          to: email,
          name: session.customer_details?.name,
          planKey: plan,
          amountCents: amount,
          currency,
          sessionId: session.id,
          depositCredited: session.metadata?.deposit_credit === "applied",
          purchaseType,
        }).catch((e) => { console.error(e); return false; });

        await logEvent("checkout.session.completed", event.id, email, lead?.id || null, amount, currency, "completed", null, {
          plan,
          purchaseType,
          sessionId: session.id,
          tosConsent: session.consent?.terms_of_service || null,
          termsVersion: session.metadata?.terms_version || null,
          termsAcceptedAt: session.metadata?.terms_accepted_at || null,
          termsAcceptedIp: session.metadata?.terms_accepted_ip || null,
          confirmationEmail: confirmationSent ? "sent" : "not_sent",
        });

        await sendAlert(
          `💰 Payment: $${(amount / 100).toFixed(2)} — ${plan}`,
          `Customer: ${email}\nAmount: $${(amount / 100).toFixed(2)} ${currency.toUpperCase()}\nPlan: ${plan} (${purchaseType.replace("_", " ")})\nTerms accepted: ${session.consent?.terms_of_service || (session.metadata?.terms_accepted_at ? "intake form" : "unknown")}\nConfirmation email: ${confirmationSent ? "sent" : "NOT sent"}\nTime: ${new Date().toLocaleString()}\n\nView: /admin`
        ).catch(console.error);
        break;
      }

      // ══════════════════════════════════════════════════════════════════════
      // PAYMENT INTENT — track success & failure reasons
      // ══════════════════════════════════════════════════════════════════════
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const email = pi.receipt_email?.toLowerCase() || "";
        const lead = email ? await findLeadByEmail(email) : null;

        if (lead) {
          await getSupabase().from("intake_submissions").update({
            last_payment_at: new Date().toISOString(),
            failed_payment_reason: null,
            updated_at: new Date().toISOString(),
          }).eq("id", lead.id);
        }

        await logEvent("payment_intent.succeeded", event.id, email, lead?.id || null, pi.amount, pi.currency, "succeeded", null, { paymentIntentId: pi.id });
        console.log(`✅ Payment intent succeeded: ${email} — $${(pi.amount / 100).toFixed(2)}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        const email = pi.receipt_email?.toLowerCase() || "";
        const failureMessage = pi.last_payment_error?.message || "Unknown failure";
        const failureCode = pi.last_payment_error?.code || null;
        const lead = email ? await findLeadByEmail(email) : null;

        if (lead) {
          await getSupabase().from("intake_submissions").update({
            failed_payment_reason: failureMessage,
            updated_at: new Date().toISOString(),
          }).eq("id", lead.id);
        }

        await logEvent("payment_intent.payment_failed", event.id, email, lead?.id || null, pi.amount, pi.currency, "failed", failureMessage, { paymentIntentId: pi.id, failureCode });

        sendAlert(
          `⚠️ Payment Failed: ${email || "Unknown"}`,
          `Customer: ${email}\nAmount: $${(pi.amount / 100).toFixed(2)}\nReason: ${failureMessage}\nCode: ${failureCode || "—"}\n\nView: /admin`
        ).catch(console.error);

        console.log(`❌ Payment failed: ${email} — ${failureMessage}`);
        break;
      }

      // ══════════════════════════════════════════════════════════════════════
      // SUBSCRIPTIONS — monthly tracking
      // ══════════════════════════════════════════════════════════════════════
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : null;
        if (!customerId) break;

        const lead = (await findLeadByCustomer(customerId)) || (await findLeadById(sub.metadata?.lead_id));
        if (!lead) { console.log(`No lead for customer ${customerId}`); break; }

        const item = sub.items?.data?.[0];
        const monthlyAmount = item?.price?.unit_amount || 0;
        const subPlan = resolvePlan(sub.metadata, monthlyAmount);
        const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end
          ? new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000).toISOString()
          : null;

        const subStatus = sub.status === "active" ? "active"
          : sub.status === "past_due" ? "past_due"
          : sub.status === "trialing" ? "trialing"
          : sub.status === "canceled" ? "cancelled"
          : sub.status;

        await getSupabase().from("intake_submissions").update({
          subscription_status: subStatus,
          subscription_id: sub.id,
          stripe_customer_id: customerId,
          subscription_plan: subPlan,
          subscription_current_period_end: periodEnd,
          monthly_amount: monthlyAmount,
          updated_at: new Date().toISOString(),
        }).eq("id", lead.id);

        await logEvent(event.type, event.id, lead.email, lead.id, monthlyAmount, sub.currency, subStatus, null, { subscriptionId: sub.id, periodEnd });

        console.log(`📋 Subscription ${event.type === "customer.subscription.created" ? "created" : "updated"}: ${lead.email} — ${subStatus} ($${(monthlyAmount / 100).toFixed(2)}/mo)`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : null;
        if (!customerId) break;

        const lead = await findLeadByCustomer(customerId);

        if (lead) {
          await getSupabase().from("intake_submissions").update({
            subscription_status: "cancelled",
            status: "lost",
            updated_at: new Date().toISOString(),
          }).eq("id", lead.id);
        }

        await logEvent("customer.subscription.deleted", event.id, lead?.email || null, lead?.id || null, 0, sub.currency, "cancelled", null, { subscriptionId: sub.id, customerId });

        sendAlert(
          `❌ Subscription Cancelled: ${lead?.email || customerId}`,
          `Customer: ${lead?.email || customerId}\nSubscription: ${sub.id}\nTime: ${new Date().toLocaleString()}\n\nView: /admin`
        ).catch(console.error);

        console.log(`❌ Subscription cancelled: ${lead?.email || customerId}`);
        break;
      }

      // ══════════════════════════════════════════════════════════════════════
      // INVOICES — monthly recurring payments
      // ══════════════════════════════════════════════════════════════════════
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const email = (invoice.customer_email || "").toLowerCase();
        const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
        const lead = email ? await findLeadByEmail(email) : (customerId ? await findLeadByCustomer(customerId) : null);

        if (lead) {
          await getSupabase().from("intake_submissions").update({
            last_payment_at: new Date().toISOString(),
            failed_payment_reason: null,
            updated_at: new Date().toISOString(),
          }).eq("id", lead.id);
        }

        await logEvent("invoice.payment_succeeded", event.id, email, lead?.id || null, invoice.amount_paid || 0, invoice.currency || "usd", "paid", null, { invoiceId: invoice.id, invoiceUrl: invoice.hosted_invoice_url });

        console.log(`✅ Invoice paid: ${email} — $${((invoice.amount_paid || 0) / 100).toFixed(2)}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const email = (invoice.customer_email || "").toLowerCase();
        const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
        const lead = email ? await findLeadByEmail(email) : (customerId ? await findLeadByCustomer(customerId) : null);
        const failureMessage = invoice.last_finalization_error?.message || "Payment method declined";

        if (lead) {
          await getSupabase().from("intake_submissions").update({
            subscription_status: "past_due",
            failed_payment_reason: failureMessage,
            updated_at: new Date().toISOString(),
          }).eq("id", lead.id);
        }

        await logEvent("invoice.payment_failed", event.id, email, lead?.id || null, invoice.amount_due || 0, invoice.currency || "usd", "failed", failureMessage, { invoiceId: invoice.id });

        sendAlert(
          `⚠️ Invoice Failed: ${email || "Unknown"} — $${((invoice.amount_due || 0) / 100).toFixed(2)}`,
          `Customer: ${email}\nAmount Due: $${((invoice.amount_due || 0) / 100).toFixed(2)}\nReason: ${failureMessage}\nAttempt: ${invoice.attempt_count || 1}\n\nView: /admin`
        ).catch(console.error);

        console.log(`❌ Invoice failed: ${email} — ${failureMessage}`);
        break;
      }

      // ══════════════════════════════════════════════════════════════════════
      // REFUNDS
      // ══════════════════════════════════════════════════════════════════════
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const email = charge.billing_details?.email?.toLowerCase() || "";
        const lead = email ? await findLeadByEmail(email) : null;

        if (lead) {
          await getSupabase().from("intake_submissions").update({
            payment_status: "refunded",
            updated_at: new Date().toISOString(),
          }).eq("id", lead.id);
        }

        await logEvent("charge.refunded", event.id, email, lead?.id || null, charge.amount_refunded || 0, charge.currency, "refunded", null, { chargeId: charge.id });

        sendAlert(
          `🔄 Refund: $${((charge.amount_refunded || 0) / 100).toFixed(2)} — ${email}`,
          `Customer: ${email}\nRefunded: $${((charge.amount_refunded || 0) / 100).toFixed(2)}\nTime: ${new Date().toLocaleString()}\n\nView: /admin`
        ).catch(console.error);

        console.log(`🔄 Refund: ${email} — $${((charge.amount_refunded || 0) / 100).toFixed(2)}`);
        break;
      }

      // ══════════════════════════════════════════════════════════════════════
      // DISPUTES — stage evidence automatically, alert immediately
      // ══════════════════════════════════════════════════════════════════════
      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        let summary = "";
        let leadId: string | null = null;
        try {
          const res = await stageDisputeEvidence(stripe, dispute);
          summary = res.summary;
          leadId = res.leadId;
        } catch (e) {
          console.error("Staging dispute evidence failed:", e);
          summary = `Automatic evidence staging FAILED: ${e instanceof Error ? e.message : String(e)} — gather evidence manually.`;
        }

        if (leadId) {
          const { error } = await getSupabase().from("intake_submissions")
            .update({ payment_status: "disputed", updated_at: new Date().toISOString() }).eq("id", leadId);
          if (error) console.error("Could not mark lead disputed:", error);
        }

        await logEvent(event.type, event.id, null, leadId, dispute.amount, dispute.currency, dispute.status, dispute.reason, {
          disputeId: dispute.id, reason: dispute.reason, dueBy: dispute.evidence_details?.due_by || null,
        });

        await sendAlert(
          `🚨 DISPUTE OPENED: $${(dispute.amount / 100).toFixed(2)} — ${dispute.reason}`,
          `A customer has disputed a payment. Evidence has been STAGED but NOT submitted.\n\n${summary}\n\nNEXT STEPS:\n1. Open https://dashboard.stripe.com/disputes/${dispute.id}\n2. Review the staged evidence; add any emails or call notes with the customer\n3. Click Submit before the due date\n\nTip: pause the customer's agents and subscription while the dispute is open (Terms section 4).`
        ).catch(console.error);
        break;
      }

      case "charge.dispute.updated":
      case "charge.dispute.closed": {
        const dispute = event.data.object as Stripe.Dispute;
        const leadId = (dispute.metadata?.lead_id as string) || null;
        if (event.type === "charge.dispute.closed" && leadId && (dispute.status === "won" || dispute.status === "lost")) {
          const { error } = await getSupabase().from("intake_submissions")
            .update({ payment_status: dispute.status === "won" ? "dispute_won" : "dispute_lost", updated_at: new Date().toISOString() }).eq("id", leadId);
          if (error) console.error("Could not update dispute outcome:", error);
        }
        await logEvent(event.type, event.id, null, leadId, dispute.amount, dispute.currency, dispute.status, dispute.reason, { disputeId: dispute.id });
        if (event.type === "charge.dispute.closed") {
          await sendAlert(
            `${dispute.status === "won" ? "✅ Dispute WON" : "❌ Dispute " + dispute.status.toUpperCase()}: $${(dispute.amount / 100).toFixed(2)}`,
            `Dispute ${dispute.id} closed with status: ${dispute.status}\nReason: ${dispute.reason}\nhttps://dashboard.stripe.com/disputes/${dispute.id}`
          ).catch(console.error);
        }
        break;
      }

      case "radar.early_fraud_warning.created": {
        const efw = event.data.object as Stripe.Radar.EarlyFraudWarning;
        const chargeId = typeof efw.charge === "string" ? efw.charge : efw.charge.id;
        await logEvent(event.type, event.id, null, null, 0, "usd", "warning", efw.fraud_type, { chargeId, actionable: efw.actionable });
        await sendAlert(
          `⚠️ Early fraud warning on charge ${chargeId}`,
          `The card issuer flagged charge ${chargeId} as possible fraud (${efw.fraud_type}). A dispute may follow.\n\nIs this a real client you have been in contact with? If the card looks stolen, consider pausing service now — the cardholder (not your client) may dispute.\n\nhttps://dashboard.stripe.com/payments/${chargeId}`
        ).catch(console.error);
        break;
      }

      // ══════════════════════════════════════════════════════════════════════
      // PAYOUTS — money hitting your bank
      // ══════════════════════════════════════════════════════════════════════
      case "payout.paid": {
        const payout = event.data.object as Stripe.Payout;
        await logEvent("payout.paid", event.id, null, null, payout.amount, payout.currency, "paid", null, { payoutId: payout.id, arrivalDate: payout.arrival_date });
        console.log(`🏦 Payout: $${(payout.amount / 100).toFixed(2)} arriving ${new Date((payout.arrival_date || 0) * 1000).toLocaleDateString()}`);
        break;
      }

      case "payout.failed": {
        const payout = event.data.object as Stripe.Payout;
        await logEvent("payout.failed", event.id, null, null, payout.amount, payout.currency, "failed", payout.failure_message || "Unknown", { payoutId: payout.id });

        sendAlert(
          `🚨 Payout Failed: $${(payout.amount / 100).toFixed(2)}`,
          `Amount: $${(payout.amount / 100).toFixed(2)}\nReason: ${payout.failure_message || "Unknown"}\nTime: ${new Date().toLocaleString()}\n\nCheck Stripe Dashboard immediately.`
        ).catch(console.error);

        console.log(`🚨 Payout failed: $${(payout.amount / 100).toFixed(2)} — ${payout.failure_message}`);
        break;
      }

      default:
        // Log everything else for audit trail
        await logEvent(event.type, event.id, null, null, 0, "usd", event.type, null, {});
        console.log(`📝 Logged event: ${event.type}`);
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
