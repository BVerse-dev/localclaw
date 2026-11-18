// ═════════════════════════════════════════════════════════════════════════════
// LocalClaw — Terms of Service & Refund Policy (single source of truth)
// Rendered on /terms and /refund-policy, quoted at checkout, in customer emails,
// and attached to Stripe dispute evidence. Bump POLICY_VERSION on any change:
// it is recorded with every customer's acceptance.
// NOTE: have a qualified lawyer review this text for your jurisdiction.
// ═════════════════════════════════════════════════════════════════════════════

export const POLICY_VERSION = "2026-11-18";
export const POLICY_EFFECTIVE = "November 18, 2026";

export const COMPANY = {
  legalName: "BVERSE INC",
  brand: "LocalClaw",
  site: "https://localclawagents.com",
  email: "localclawagents@gmail.com",
  descriptor: "LOCALCLAW or BVERSE INC",
};

export const TERMS_URL = `${COMPANY.site}/terms`;
export const REFUND_URL = `${COMPANY.site}/refund-policy`;

/** One-line disclosure shown next to every payment button. */
export const NON_REFUNDABLE_NOTICE =
  "All payments are final and non-refundable. Monthly plans can be cancelled anytime to stop future billing.";

export interface PolicySection {
  heading: string;
  body: string[];
}

export const REFUND_POLICY: PolicySection[] = [
  {
    heading: "1. All payments are final",
    body: [
      "All payments made to LocalClaw (operated by BVERSE INC) are final and non-refundable. This includes the $97 discovery deposit, one-time setup fees, monthly retainers, additional agents, and any custom work.",
      "Work begins as soon as you pay: we reserve delivery capacity, provision infrastructure, configure agent frameworks, and incur third-party costs on your behalf. Because these resources cannot be recovered, we do not offer refunds, partial refunds, or credits for unused time.",
    ],
  },
  {
    heading: "2. Discovery deposit",
    body: [
      "The $97 discovery deposit reserves your scoping call. It is non-refundable, and it is credited in full toward the setup fee of any LocalClaw plan you purchase. The credit is applied automatically at checkout when you use the same email address.",
    ],
  },
  {
    heading: "3. Know exactly what you're buying",
    body: [
      "Before you pay for a plan, its price, inclusions, and monthly fee are shown on our pricing page, on the intake form, and on the Stripe checkout page. You must actively agree to our Terms of Service and this Refund Policy before any payment is taken.",
      "If you are unsure which plan fits, start with the discovery deposit — we will scope your deployment and confirm the deliverables before you commit to a plan.",
    ],
  },
  {
    heading: "4. Monthly plans and cancellation",
    body: [
      "Monthly retainers renew automatically each month on the date of your original purchase until cancelled.",
      "You may cancel at any time by emailing localclawagents@gmail.com with the subject \"Cancel subscription\" from the email address on your account. Cancellation takes effect at the end of your current billing period: you will not be charged again, and your agents remain active until that date. We confirm every cancellation in writing within one business day.",
      "Payments already made for the current or past billing periods are not refunded, prorated, or credited.",
    ],
  },
  {
    heading: "5. Plan changes",
    body: [
      "Upgrades take effect immediately; you pay the difference in setup fee and the new monthly rate from the next billing date. Downgrades take effect from the next billing date. Plan changes never generate refunds or credits.",
    ],
  },
  {
    heading: "6. Our service commitment",
    body: [
      "Instead of refunds, we stand behind the work. If something in your agreed scope is not working as described, tell us: during hypercare and throughout your monthly plan we will fix, re-configure, or re-deploy your agents at no extra cost until the agreed scope is delivered.",
      "Report issues to localclawagents@gmail.com. We respond within one business day.",
    ],
  },
  {
    heading: "7. Billing questions and disputes",
    body: [
      "Charges appear on your statement as LOCALCLAW or BVERSE INC. If you do not recognise a charge or believe you were billed in error, contact us first at localclawagents@gmail.com — we resolve genuine billing errors (such as a duplicate charge) promptly.",
      "Filing a chargeback or payment dispute for a charge you authorised is a breach of our Terms of Service. We respond to every dispute with evidence of your purchase, your acceptance of these terms, and the services delivered, and we may suspend services on the account while a dispute is open.",
    ],
  },
  {
    heading: "8. Your statutory rights",
    body: [
      "Nothing in this policy limits any right you have under applicable law that cannot be waived by agreement.",
    ],
  },
];

export const TERMS: PolicySection[] = [
  {
    heading: "1. Agreement",
    body: [
      "These Terms of Service (\"Terms\") are an agreement between you (the client) and BVERSE INC, operating as LocalClaw (\"LocalClaw\", \"we\", \"us\"). By submitting our intake form, making a payment, or using our services, you agree to these Terms and to our Refund Policy, which forms part of them. If you are accepting on behalf of a business, you confirm you are authorised to bind it.",
    ],
  },
  {
    heading: "2. Our services",
    body: [
      "LocalClaw designs, deploys, secures, and manages AI agents for businesses on third-party agent frameworks and AI models — including OpenClaw, Hermes Agent, NVIDIA NemoClaw, the Claude Agent SDK, the OpenAI Agents SDK, n8n, CrewAI, LangGraph, and custom builds. The specific agents, integrations, and channels included depend on your plan as described on our pricing page at the time of purchase, and on the scope confirmed with you during onboarding.",
      "Delivery timelines (for example, \"live in under 24 hours\") are targets that depend on you providing the access, accounts, and information we request.",
    ],
  },
  {
    heading: "3. Fees and payment",
    body: [
      "Prices are listed in US dollars and exclude applicable taxes, which are calculated at checkout. Setup fees are charged once at purchase. Monthly retainers are charged in advance each month by Stripe, our payment processor, until cancelled.",
      "All payments are final and non-refundable, as set out in our Refund Policy. You authorise us to charge your payment method for all fees under your plan.",
      "Third-party usage costs incurred by your agents — for example AI model API usage, messaging provider fees (such as WhatsApp Business), or telephony — are billed by those providers to accounts in your name unless your plan states otherwise.",
    ],
  },
  {
    heading: "4. Cancellation",
    body: [
      "You may cancel a monthly plan at any time as described in the Refund Policy; cancellation stops future charges at the end of the current billing period. We may terminate or suspend services if you breach these Terms, fail to pay, or open a payment dispute for a charge you authorised.",
    ],
  },
  {
    heading: "5. Your responsibilities",
    body: [
      "You will provide accurate information, the access and credentials needed to connect your tools, and timely approvals. You are responsible for the content your agents are instructed to send, for complying with laws that apply to your business and your communications with customers (including consent, privacy, and marketing rules), and for keeping your own account credentials secure.",
    ],
  },
  {
    heading: "6. AI output",
    body: [
      "AI agents generate content automatically and can make mistakes. We configure guardrails, approvals, and escalation rules to reduce risk, but you remain responsible for reviewing and supervising your agents' actions, especially those involving money, legal commitments, health, or personal data.",
    ],
  },
  {
    heading: "7. Third-party frameworks and providers",
    body: [
      "Our services rely on third-party frameworks, AI models, hosting, and messaging platforms that we do not control. Their availability, pricing, terms, and features may change. We will make reasonable efforts to adapt or migrate your agents when that happens, but we are not liable for third-party outages or changes.",
    ],
  },
  {
    heading: "8. Data and security",
    body: [
      "We process your business data only to provide the services. We use OAuth connections where available, scoped permissions, sandboxing, and audit logging. You retain ownership of your data and may request its export or deletion when your services end.",
    ],
  },
  {
    heading: "9. Intellectual property",
    body: [
      "You own your business content and data, and the agent persona documents created specifically for you once paid for. LocalClaw retains ownership of its templates, tools, scripts, know-how, and any pre-existing materials, and grants you a licence to use them as part of the services.",
    ],
  },
  {
    heading: "10. Disclaimers and limitation of liability",
    body: [
      "Except as expressly stated in these Terms, the services are provided \"as is\" without warranties of any kind. To the maximum extent permitted by law, LocalClaw is not liable for indirect, incidental, or consequential losses, lost profits, or lost data, and our total liability for any claim is limited to the fees you paid in the three months before the claim arose.",
    ],
  },
  {
    heading: "11. Payment disputes",
    body: [
      "Please contact us before contacting your bank about any charge. Opening a chargeback for an authorised payment breaches these Terms; we will contest it using records of your purchase, your acceptance of these Terms, and the services delivered.",
    ],
  },
  {
    heading: "12. Changes and contact",
    body: [
      "We may update these Terms; the version you accepted at purchase applies to that purchase, and continued use after an update means you accept the new version for future billing. Questions: localclawagents@gmail.com.",
    ],
  },
];

/** Plain-text rendering (emails, dispute evidence PDFs). */
export function policyAsText(sections: PolicySection[]): string[] {
  const out: string[] = [];
  for (const s of sections) {
    out.push(s.heading, ...s.body, "");
  }
  return out;
}
