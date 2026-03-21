import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });

function isAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get("lc_admin");
  return cookie?.value === process.env.ADMIN_PASSWORD;
}

// GET — fetch payment stats + recent Stripe charges + sync status
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch payment summary from Supabase
    const { data: allLeads } = await getSupabase()
      .from("intake_submissions")
      .select("id, email, name, business, budget, plan, payment_status, payment_amount, payment_currency, stripe_customer_id, paid_at, status, created_at");

    const leads = allLeads || [];
    const paid = leads.filter(l => l.payment_status === "paid");
    const unpaid = leads.filter(l => l.payment_status === "unpaid");
    const refunded = leads.filter(l => l.payment_status === "refunded");

    const totalRevenue = paid.reduce((sum, l) => sum + (l.payment_amount || 0), 0);

    // Count by plan
    const planCounts: Record<string, number> = {};
    const planRevenue: Record<string, number> = {};
    paid.forEach(l => {
      const p = l.plan || "discovery";
      planCounts[p] = (planCounts[p] || 0) + 1;
      planRevenue[p] = (planRevenue[p] || 0) + (l.payment_amount || 0);
    });

    // Fetch recent charges from Stripe directly (last 20)
    let recentCharges: Array<{
      id: string;
      amount: number;
      currency: string;
      email: string;
      name: string;
      status: string;
      created: number;
      refunded: boolean;
      receiptUrl: string | null;
      matchedLeadId: string | null;
    }> = [];

    try {
      const charges = await stripe.charges.list({ limit: 20 });
      const leadEmailMap: Record<string, string> = {};
      leads.forEach(l => { leadEmailMap[l.email?.toLowerCase()] = l.id; });

      recentCharges = charges.data.map(c => ({
        id: c.id,
        amount: c.amount,
        currency: c.currency,
        email: c.billing_details?.email?.toLowerCase() || "",
        name: c.billing_details?.name || "Unknown",
        status: c.status,
        created: c.created,
        refunded: c.refunded,
        receiptUrl: c.receipt_url || null,
        matchedLeadId: leadEmailMap[c.billing_details?.email?.toLowerCase() || ""] || null,
      }));
    } catch (err) {
      console.error("Failed to fetch Stripe charges:", err);
    }

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalPaid: paid.length,
        totalUnpaid: unpaid.length,
        totalRefunded: refunded.length,
        totalLeads: leads.length,
        conversionRate: leads.length > 0 ? Math.round((paid.length / leads.length) * 100) : 0,
        planCounts,
        planRevenue,
      },
      recentCharges,
      paidLeads: paid.map(l => ({
        id: l.id,
        name: l.name,
        email: l.email,
        business: l.business,
        plan: l.plan,
        amount: l.payment_amount,
        currency: l.payment_currency,
        paidAt: l.paid_at,
        status: l.status,
      })),
      unpaidLeads: unpaid.map(l => ({
        id: l.id,
        name: l.name,
        email: l.email,
        business: l.business,
        budget: l.budget,
        status: l.status,
        createdAt: l.created_at,
      })),
    });
  } catch (err) {
    console.error("Payments API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST — manual sync: check Stripe for payments matching leads
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all unpaid leads
    const { data: unpaidLeads } = await getSupabase()
      .from("intake_submissions")
      .select("id, email")
      .eq("payment_status", "unpaid");

    if (!unpaidLeads || unpaidLeads.length === 0) {
      return NextResponse.json({ synced: 0, message: "No unpaid leads to check" });
    }

    const emailToId: Record<string, string> = {};
    unpaidLeads.forEach(l => { emailToId[l.email.toLowerCase()] = l.id; });

    // Check recent Stripe sessions for matching emails
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
    });

    let synced = 0;
    for (const session of sessions.data) {
      const email = (session.customer_email || session.customer_details?.email || "").toLowerCase();
      const leadId = emailToId[email];
      if (!leadId) continue;

      const amount = session.amount_total || 0;
      let plan = "discovery";
      if (amount >= 350000) plan = "fullstack";
      else if (amount >= 199700) plan = "business";
      else if (amount >= 99700) plan = "starter";

      const customerId = typeof session.customer === "string" ? session.customer : null;

      await getSupabase()
        .from("intake_submissions")
        .update({
          payment_status: "paid",
          payment_amount: amount,
          payment_currency: session.currency || "usd",
          stripe_customer_id: customerId,
          stripe_session_id: session.id,
          stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
          paid_at: new Date(session.created * 1000).toISOString(),
          plan,
          updated_at: new Date().toISOString(),
        })
        .eq("id", leadId);

      synced++;
      delete emailToId[email]; // Don't double-match
    }

    return NextResponse.json({ synced, message: `Synced ${synced} payment(s)` });
  } catch (err) {
    console.error("Payment sync error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
