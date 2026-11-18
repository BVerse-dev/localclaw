import { getPlan, DISCOVERY, usd } from "@/lib/plans";
import { COMPANY, REFUND_URL, TERMS_URL, POLICY_VERSION } from "@/lib/policy";

// Order confirmation sent to the customer after every successful checkout.
// Clear receipts with the policy restated are the cheapest chargeback prevention there is,
// and the email itself becomes "customer communication" evidence in a dispute.

export type PurchaseType = "deposit" | "full" | "setup_only" | "monthly_only";

/** What did this checkout actually buy? (combined link/site checkout vs setup-only vs monthly-only links) */
export function purchaseTypeOf(opts: { planKey: string; mode: string | null | undefined; subtotalCents: number }): PurchaseType {
  const plan = getPlan(opts.planKey);
  if (!plan) return "deposit";
  if (opts.mode === "payment") return "setup_only";
  if (opts.mode === "subscription" && opts.subtotalCents > 0 && opts.subtotalCents <= plan.monthly * 100) return "monthly_only";
  return "full";
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export async function sendPurchaseConfirmation(opts: {
  to: string;
  name?: string | null;
  planKey: string;
  amountCents: number;
  currency: string;
  sessionId: string;
  depositCredited?: boolean;
  purchaseType?: PurchaseType;
}): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || !opts.to) return false;
  const plan = getPlan(opts.planKey);
  const type: PurchaseType = !plan ? "deposit" : opts.purchaseType || "full";
  const what =
    type === "deposit" ? `${DISCOVERY.name} — ${usd(DISCOVERY.amount)}`
    : type === "setup_only" ? `${plan!.name} — setup only (${usd(plan!.setup)}, one-time)`
    : type === "monthly_only" ? `${plan!.name} — monthly management (${usd(plan!.monthly)}/month)`
    : `${plan!.name} — ${usd(plan!.setup)} setup + ${usd(plan!.monthly)}/month`;
  const paid = `${usd(opts.amountCents / 100)} ${opts.currency.toUpperCase()}`;
  const first = (opts.name || "").split(" ")[0] || "there";

  const lines = [
    `Hi ${first},`,
    "",
    `Thank you for your purchase. Here is your confirmation for your records.`,
    "",
    `Purchase: ${what}`,
    `Amount paid today: ${paid}${opts.depositCredited ? " (includes your $97 discovery deposit credit)" : ""}`,
    `Reference: ${opts.sessionId}`,
    `Statement descriptor: charges appear as ${COMPANY.descriptor}.`,
    "",
    "WHAT HAPPENS NEXT",
    type === "deposit"
      ? "We'll contact you within 2 hours (business hours) to book your scoping call. Your $97 is credited in full toward the setup fee of any plan you choose."
      : type === "setup_only"
      ? `We'll contact you within 2 hours (business hours) to schedule your kickoff, confirm your agent frameworks, and start your deployment. This is a one-time payment covering setup and the included hypercare period — there is no recurring charge. Ongoing monthly management (${usd(plan!.monthly)}/month) can be added at any time; just reply to this email.`
      : type === "monthly_only"
      ? `Your monthly management is active and renews at ${usd(plan!.monthly)}/month until cancelled. We'll be in touch to confirm your agents are covered.`
      : `We'll contact you within 2 hours (business hours) to schedule your kickoff, confirm your agent frameworks, and start your deployment. Your plan renews at ${usd(plan!.monthly)}/month until cancelled.`,
    "",
    "BILLING POLICY",
    "All payments are final and non-refundable, as agreed at checkout.",
    type === "full" || type === "monthly_only" ? `To cancel future monthly billing at any time, email ${COMPANY.email} with the subject "Cancel subscription". Your agents stay active until the end of the paid period.` : "",
    `If anything in your agreed scope isn't working as described, reply to this email and we'll fix it at no extra cost.`,
    `Refund Policy: ${REFUND_URL}`,
    `Terms of Service (v${POLICY_VERSION}): ${TERMS_URL}`,
    "",
    "Questions about a charge? Please reply to this email before contacting your bank — we resolve billing questions within one business day.",
    "",
    `— The ${COMPANY.brand} team`,
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "");

  const html = `<div style="font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;max-width:560px">${lines
    .map((l) => (l === "" ? "<br/>" : /^[A-Z ]{6,}$/.test(l) ? `<p style="margin:16px 0 4px;font-weight:700;letter-spacing:.08em;font-size:12px;color:#8a6a1f">${esc(l)}</p>` : `<p style="margin:0">${esc(l).replace(/(https:\/\/\S+)/g, '<a href="$1">$1</a>')}</p>`))
    .join("")}</div>`;

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: `${COMPANY.brand} <billing@mail.localclawagents.com>`,
    to: opts.to,
    replyTo: COMPANY.email,
    subject: `Your ${COMPANY.brand} purchase confirmation — ${plan ? plan.name + (type === "setup_only" ? " (setup)" : type === "monthly_only" ? " (monthly)" : "") : DISCOVERY.name}`,
    text: lines.join("\n"),
    html,
  });
  if (error) {
    console.error("Purchase confirmation email failed:", error);
    return false;
  }
  return true;
}
