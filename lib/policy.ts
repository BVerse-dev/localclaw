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
      "We process your business data only to provide the services. We use OAuth connections where available, scoped permissions, sandboxing, and audit logging. You retain ownership of your data and may request its export or deletion when your services end. Our Privacy Policy (localclawagents.com/privacy) explains how we handle personal information.",
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

export const PRIVACY_URL = `${COMPANY.site}/privacy`;

export const PRIVACY_POLICY: PolicySection[] = [
  {
    heading: "1. Who we are",
    body: [
      "LocalClaw is operated by BVERSE INC (\"LocalClaw\", \"we\", \"us\"). We are the controller of the personal information described in this policy, except where we process data inside your AI agents on your behalf — there, you are the controller and we act as your processor (see section 7).",
      "Contact for any privacy question or request: localclawagents@gmail.com.",
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      "Information you give us: when you complete our intake form we collect your name, email address, phone number, business name, industry, team size, the plan and automations you are interested in, your preferred agent framework, and anything you write in the details field. If you email us or book a call, we keep that correspondence and booking information.",
      "Purchase and agreement records: when you pay, we receive from Stripe your name, email, phone number, billing address, the plan purchased, amounts, and payment status. We record your acceptance of our Terms of Service and Refund Policy, including the policy version, the date and time, your IP address, and your browser's user agent.",
      "Payment card details are entered directly into Stripe's checkout and are never received or stored by LocalClaw.",
      "Website usage: our hosting provider records standard technical logs (such as IP address, browser type, and pages requested) for security and reliability, and we use Vercel Web Analytics, which measures aggregate page views without cookies and without identifying you across sites.",
      "Service data: when we deploy agents for you, we access the business accounts and data you connect (for example email, calendar, CRM, and messaging channels) and the messages your agents handle, including personal information about your own customers.",
    ],
  },
  {
    heading: "3. How we use information",
    body: [
      "We use personal information to: respond to your enquiry and scope your deployment; process payments and send receipts and confirmations; deliver, secure, monitor, and support your AI agents; communicate with you about your service and billing; keep records of your purchase and acceptance of our terms, including to respond to payment disputes and chargebacks; detect and prevent fraud and abuse; comply with legal, tax, and accounting obligations; and improve our website and services.",
      "We do not sell your personal information, and we do not use it for third-party advertising.",
      "Our legal bases (where applicable law requires them) are: performing our contract with you, our legitimate interests in running and protecting our business (including defending disputes), compliance with legal obligations, and your consent where we ask for it.",
    ],
  },
  {
    heading: "4. Who we share information with",
    body: [
      "We share personal information only with service providers that help us run LocalClaw, under contracts that limit their use of it: Vercel (website hosting and analytics), Supabase (database), Stripe (payments, fraud prevention, and dispute handling), Resend (email delivery), and Cal.com (call scheduling). Fonts and icons are loaded from Google Fonts and jsDelivr, which receive your IP address when you load our pages.",
      "To run your agents, the data your agents process is sent to the AI model providers, agent frameworks, hosting, and messaging platforms used in your deployment (for example Anthropic, OpenAI, NVIDIA, Meta/WhatsApp, Telegram, and the server provider hosting your agents), as agreed with you during onboarding.",
      "We may also disclose information to a card issuer or payment network when responding to a dispute on your payment; to professional advisers; when required by law or to protect our rights, users, or the public; or to a successor if our business is sold or reorganised.",
      "Information is shared by secure, encrypted API connections or within the provider's own platform — never by unencrypted email of bulk data.",
    ],
  },
  {
    heading: "5. How we protect information",
    body: [
      "We protect information with encryption in transit (TLS), encryption at rest provided by our infrastructure providers, access controls limited to staff who need access, signed and expiring administrator sessions, OAuth connections instead of shared passwords wherever possible, least-privilege permissions for agents, sandboxed agent environments, and audit logs of agent actions. No system is perfectly secure; if we become aware of a breach affecting your personal information, we will notify you and any regulator as required by law.",
    ],
  },
  {
    heading: "6. How long we keep information",
    body: [
      "Enquiries from people who do not become clients: up to 24 months after our last contact, then deleted. Client account and service records: for the duration of your service and up to 24 months afterwards. Purchase, payment, and terms-acceptance records: 7 years, to meet tax and accounting obligations and to respond to payment disputes. Data processed inside your agents: deleted or returned to you within 30 days after your service ends, unless you ask us to delete it sooner.",
    ],
  },
  {
    heading: "7. Data we process for clients",
    body: [
      "When your agents handle personal information about your customers, you decide what is collected and why, and we process it only to provide the service to you and on your instructions. You are responsible for having a lawful basis and giving your customers any notices required for that processing. We will help you respond to your customers' privacy requests about data held in your agents.",
    ],
  },
  {
    heading: "8. Your rights",
    body: [
      "Depending on where you live (including under the UK and EU GDPR and US state laws such as the CCPA), you may have the right to access, correct, delete, or receive a copy of your personal information, to object to or restrict certain processing, and to withdraw consent. We do not sell or share personal information for cross-context behavioural advertising.",
      "To make a request, email localclawagents@gmail.com from the address associated with your account. We will respond within 30 days and may need to verify your identity. Some records (for example, payment and terms-acceptance records) may be retained where we are legally required or entitled to keep them.",
      "If you are in the UK or EU and are unhappy with how we handle your information, you can complain to your local data protection authority (in the UK, the Information Commissioner's Office). We would appreciate the chance to resolve your concern first.",
    ],
  },
  {
    heading: "9. Cookies",
    body: [
      "Our public website does not use advertising or tracking cookies, and our analytics are cookie-free. We set a strictly necessary cookie only when an administrator signs in. Stripe sets its own cookies on its checkout pages to process payments securely and prevent fraud; see Stripe's privacy policy for details.",
    ],
  },
  {
    heading: "10. International transfers",
    body: [
      "Our service providers may process information in the United States, the United Kingdom, the European Economic Area, and other countries. Where required, transfers are protected by appropriate safeguards such as standard contractual clauses.",
    ],
  },
  {
    heading: "11. Children",
    body: [
      "Our services are for businesses and are not directed at anyone under 18. We do not knowingly collect personal information from children.",
    ],
  },
  {
    heading: "12. Changes to this policy",
    body: [
      "We may update this policy from time to time. We will post the new version on this page with a new effective date and, for material changes, notify clients by email.",
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
