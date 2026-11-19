import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { DISCOVERY, DISCOVERY_CREDIT_COUPON, getPlan } from "@/lib/plans";
import { POLICY_VERSION, REFUND_URL, TERMS_URL } from "@/lib/policy";

export const runtime = "nodejs";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://localclawagents.com";

function stripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

/**
 * Has this email paid the $97 discovery deposit without it being credited yet?
 * Stripe is the source of truth: a completed deposit session (tagged, or $97 from the
 * original payment link) and no later completed session that consumed the credit.
 */
async function hasUnusedDepositCredit(stripe: Stripe, email: string): Promise<boolean> {
  const sessions = await stripe.checkout.sessions.list({
    customer_details: { email },
    status: "complete",
    limit: 100,
  });
  const paidDeposit = sessions.data.some(
    (s) => s.metadata?.plan === "discovery" || s.amount_total === DISCOVERY.amount * 100,
  );
  const alreadyCredited = sessions.data.some((s) => s.metadata?.deposit_credit === "applied");
  return paidDeposit && !alreadyCredited;
}

/** Client IP as seen by Vercel (first hop of x-forwarded-for). */
function clientIp(req: NextRequest): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "";
}

/** Stripe rejects consent_collection until a Terms URL is set in Dashboard → Settings → Public details. */
function isMissingTosUrlError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /terms of service|terms_of_service|consent_collection/i.test(msg);
}

/**
 * POST /api/checkout  { plan, email?, leadId?, termsAccepted }
 * Creates a Stripe Checkout Session:
 *  - discovery → one-time $97 deposit
 *  - plan tiers → subscription (monthly retainer) + one-time setup fee on the first invoice
 * Every session/subscription is tagged with metadata.plan + lead_id so the webhook
 * never has to guess the plan from the amount.
 * Falls back to the static payment link if Stripe isn't configured for the plan.
 */
export async function POST(req: NextRequest) {
  let body: { plan?: string; email?: string; leadId?: string; termsAccepted?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const planKey = body.plan || "discovery";
  const email = typeof body.email === "string" && body.email.includes("@") ? body.email.trim().toLowerCase() : undefined;
  const leadId = typeof body.leadId === "string" ? body.leadId.slice(0, 64) : "";
  const plan = getPlan(planKey);

  if (planKey !== "discovery" && !plan) {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }
  // No payment without prior, recorded acceptance of the Terms & Refund Policy.
  if (body.termsAccepted !== true) {
    return NextResponse.json({ error: "You must accept the Terms of Service and Refund Policy." }, { status: 400 });
  }

  const fallback = plan ? plan.stripe.link : DISCOVERY.stripe.link;
  const stripe = stripeClient();
  // Dispute evidence: what was accepted, when, and from where (Stripe metadata values ≤ 500 chars).
  const metadata = {
    plan: planKey,
    lead_id: leadId,
    source: "localclaw-site",
    terms_version: POLICY_VERSION,
    terms_accepted_at: new Date().toISOString(),
    terms_accepted_ip: clientIp(req).slice(0, 100),
    terms_accepted_ua: (req.headers.get("user-agent") || "").slice(0, 300),
    non_refundable_disclosed: "pricing_page,intake_checkbox,checkout_page",
  };
  const common = {
    customer_email: email,
    client_reference_id: leadId || undefined,
    metadata,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
    phone_number_collection: { enabled: true },
    // Chargeback defence: AVS address match. 3D Secure is left on Stripe's default ("automatic"):
    // it runs only when the bank or Radar asks for it — forcing it on every card blocked real buyers.
    billing_address_collection: "required",
    consent_collection: { terms_of_service: "required" },
    custom_text: {
      terms_of_service_acceptance: {
        message: `I agree to the [Terms of Service](${TERMS_URL}) and [Refund Policy](${REFUND_URL}), and understand that **all payments are final and non-refundable**.`,
      },
      submit: {
        message: "All payments are final and non-refundable. Monthly plans can be cancelled anytime to stop future billing.",
      },
    },
  } satisfies Partial<Stripe.Checkout.SessionCreateParams>;

  /** Create the session; if the Stripe account has no Terms URL yet, retry with the notice only. */
  const create = async (params: Stripe.Checkout.SessionCreateParams) => {
    try {
      return await stripe!.checkout.sessions.create(params);
    } catch (err) {
      if (!isMissingTosUrlError(err)) throw err;
      console.warn("Stripe Terms of Service URL not configured — creating session without consent checkbox");
      const { consent_collection: _c, custom_text, ...rest } = params;
      return await stripe!.checkout.sessions.create({ ...rest, custom_text: { submit: custom_text?.submit } });
    }
  };

  try {
    if (!stripe) throw new Error("STRIPE_SECRET_KEY not set");

    let session: Stripe.Checkout.Session;

    if (!plan) {
      session = await create({
        mode: "payment",
        line_items: [{
          quantity: 1,
          price_data: { currency: "usd", product: DISCOVERY.stripe.product, unit_amount: DISCOVERY.amount * 100 },
        }],
        ...common,
        customer_creation: "always",
        payment_intent_data: { metadata },
        success_url: `${SITE}/thank-you?plan=discovery&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE}/intake?plan=discovery&cancelled=1`,
      });
    } else {
      if (!plan.stripe.setupProduct || !plan.stripe.monthlyProduct) throw new Error(`Stripe products missing for ${plan.key}`);

      // Credit a previously paid $97 deposit against the first invoice.
      let credit = false;
      if (email) {
        try { credit = await hasUnusedDepositCredit(stripe, email); }
        catch (e) { console.error("Deposit credit lookup failed:", e); }
      }
      const tagged = credit ? { ...metadata, deposit_credit: "applied" } : metadata;

      session = await create({
        mode: "subscription",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              product: plan.stripe.monthlyProduct,
              unit_amount: plan.monthly * 100,
              recurring: { interval: "month" },
            },
          },
          {
            // one-time setup fee, charged on the first invoice
            quantity: 1,
            price_data: { currency: "usd", product: plan.stripe.setupProduct, unit_amount: plan.setup * 100 },
          },
        ],
        ...common,
        metadata: tagged,
        subscription_data: { metadata: tagged },
        // Stripe doesn't allow promo codes and a discount together
        ...(credit ? { allow_promotion_codes: undefined, discounts: [{ coupon: DISCOVERY_CREDIT_COUPON }] } : {}),
        success_url: `${SITE}/thank-you?plan=${plan.key}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${SITE}/intake?plan=${plan.key}&cancelled=1`,
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error — falling back to payment link:", err);
    if (!fallback) return NextResponse.json({ error: "Checkout unavailable" }, { status: 503 });
    const url = new URL(fallback);
    if (email) url.searchParams.set("prefilled_email", email);
    if (leadId) url.searchParams.set("client_reference_id", leadId);
    return NextResponse.json({ url: url.toString(), fallback: true });
  }
}
