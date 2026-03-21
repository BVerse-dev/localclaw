import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });

// Disable body parsing — Stripe needs raw body for signature verification
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

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await buffer(req.body!);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && webhookSecret !== "whsec_PASTE_AFTER_WEBHOOK_SETUP") {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Fallback: parse without verification (dev only)
      event = JSON.parse(body.toString()) as Stripe.Event;
      console.warn("⚠️ Stripe webhook signature not verified — set STRIPE_WEBHOOK_SECRET");
    }
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(sub);
        break;
      }
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ── Checkout completed — match customer email to lead ────────────────────────
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const email = (session.customer_email || session.customer_details?.email || "").toLowerCase();
  const amount = session.amount_total || 0;
  const currency = session.currency || "usd";
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id || null;

  console.log(`💰 Checkout completed: ${email} — $${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`);

  if (!email) {
    console.warn("No email on checkout session — cannot match to lead");
    return;
  }

  // Determine plan from amount (in cents)
  let plan = "discovery";
  if (amount >= 350000) plan = "fullstack";
  else if (amount >= 199700) plan = "business";
  else if (amount >= 99700) plan = "starter";

  // Try to find and update existing lead
  const { data: leads } = await getSupabase()
    .from("intake_submissions")
    .select("id, status, payment_status")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1);

  if (leads && leads.length > 0) {
    const lead = leads[0];
    const updates: Record<string, unknown> = {
      payment_status: "paid",
      payment_amount: amount,
      payment_currency: currency,
      stripe_customer_id: customerId,
      stripe_session_id: session.id,
      stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
      paid_at: new Date().toISOString(),
      plan,
      updated_at: new Date().toISOString(),
    };

    // Auto-advance status if still early in pipeline
    if (["new", "contacted"].includes(lead.status)) {
      updates.status = "onboarded";
    }

    await getSupabase()
      .from("intake_submissions")
      .update(updates)
      .eq("id", lead.id);

    console.log(`✅ Updated lead ${lead.id} → paid (${plan})`);
  } else {
    // No matching lead — create a placeholder entry
    await getSupabase()
      .from("intake_submissions")
      .insert({
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
        plan,
      });

    console.log(`✅ Created new lead from Stripe payment: ${email} (${plan})`);
  }

  // Send email alert about payment
  sendPaymentAlert(email, amount, currency, plan).catch(err =>
    console.error("Payment alert email failed:", err)
  );
}

// ── Refund ───────────────────────────────────────────────────────────────────
async function handleRefund(charge: Stripe.Charge) {
  const email = charge.billing_details?.email?.toLowerCase();
  if (!email) return;

  await getSupabase()
    .from("intake_submissions")
    .update({
      payment_status: "refunded",
      updated_at: new Date().toISOString(),
    })
    .eq("email", email);

  console.log(`🔄 Refund processed for ${email}`);
}

// ── Subscription cancelled ───────────────────────────────────────────────────
async function handleSubscriptionCancelled(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (!customerId) return;

  await getSupabase()
    .from("intake_submissions")
    .update({
      status: "lost",
      admin_notes: `Subscription cancelled on ${new Date().toLocaleDateString()}`,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);

  console.log(`❌ Subscription cancelled for customer ${customerId}`);
}

// ── Payment alert email ──────────────────────────────────────────────────────
async function sendPaymentAlert(email: string, amount: number, currency: string, plan: string) {
  const alertEmail = process.env.ALERT_EMAIL;
  if (!alertEmail || !process.env.RESEND_API_KEY) return;

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "LocalClaw <alerts@mail.localclawagents.com>",
    to: alertEmail,
    subject: `💰 Payment Received: $${(amount / 100).toFixed(2)} — ${plan} plan`,
    text: `
NEW PAYMENT RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Customer:  ${email}
Amount:    $${(amount / 100).toFixed(2)} ${currency.toUpperCase()}
Plan:      ${plan}
Time:      ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
View in dashboard: /admin
    `.trim(),
  });
}
