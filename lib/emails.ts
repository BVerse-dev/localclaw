import { getPlan, DISCOVERY, usd } from "@/lib/plans";
import { COMPANY, REFUND_URL, TERMS_URL, POLICY_VERSION } from "@/lib/policy";

// Order confirmation sent to the customer after every successful checkout.
// Clear receipts with the policy restated are the cheapest chargeback prevention there is,
// and the email itself becomes "customer communication" evidence in a dispute.

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export async function sendPurchaseConfirmation(opts: {
  to: string;
  name?: string | null;
  planKey: string;
  amountCents: number;
  currency: string;
  sessionId: string;
  depositCredited?: boolean;
}): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || !opts.to) return false;
  const plan = getPlan(opts.planKey);
  const isDeposit = !plan;
  const what = plan
    ? `${plan.name} — ${usd(plan.setup)} setup + ${usd(plan.monthly)}/month`
    : `${DISCOVERY.name} — ${usd(DISCOVERY.amount)}`;
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
    isDeposit
      ? "We'll contact you within 2 hours (business hours) to book your scoping call. Your $97 is credited in full toward the setup fee of any plan you choose."
      : `We'll contact you within 2 hours (business hours) to schedule your kickoff, confirm your agent frameworks, and start your deployment. Your plan renews at ${usd(plan!.monthly)}/month until cancelled.`,
    "",
    "BILLING POLICY",
    "All payments are final and non-refundable, as agreed at checkout.",
    plan ? `To cancel future monthly billing at any time, email ${COMPANY.email} with the subject "Cancel subscription". Your agents stay active until the end of the paid period.` : "",
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
    subject: `Your ${COMPANY.brand} purchase confirmation — ${plan ? plan.name : DISCOVERY.name}`,
    text: lines.join("\n"),
    html,
  });
  if (error) {
    console.error("Purchase confirmation email failed:", error);
    return false;
  }
  return true;
}
