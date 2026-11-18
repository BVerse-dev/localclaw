import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { POLICY_VERSION } from "@/lib/policy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, phone, business, industry, teamSize, budget, automations, details, termsAccepted, termsVersion } = body;

    // Validate required fields
    if (!name || !email || !business) {
      return NextResponse.json({ error: "Name, email, and business are required." }, { status: 400 });
    }
    if (termsAccepted !== true) {
      return NextResponse.json({ error: "You must accept the Terms of Service and Refund Policy." }, { status: 400 });
    }

    // Server-side acceptance record (dispute evidence) — timestamp and IP are set here, not by the client
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
    const consentLine = `[Terms ${String(termsVersion || POLICY_VERSION).slice(0, 20)} accepted ${new Date().toISOString()} from ${ip.slice(0, 64)}; non-refundable acknowledged]`;
    const detailsWithConsent = [details, consentLine].filter(Boolean).join("\n");

    // Insert into Supabase
    const { data, error } = await getSupabase()
      .from("intake_submissions")
      .insert({
        name,
        email,
        phone: phone || null,
        business,
        industry: industry || null,
        team_size: teamSize || null,
        budget: budget || null,
        automations: automations || [],
        details: detailsWithConsent,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
    }

    // Send email alert (fire-and-forget — don't block the response)
    sendEmailAlert({ name, email, phone, business, industry, teamSize, budget, automations, details }).catch(
      (err) => console.error("Email alert failed:", err)
    );

    return NextResponse.json({ success: true, id: data.id }, { status: 200 });
  } catch (err) {
    console.error("Intake API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ── Email alert via Resend ───────────────────────────────────────────────────
async function sendEmailAlert(data: Record<string, unknown>) {
  const alertEmail = process.env.ALERT_EMAIL;
  if (!alertEmail || !process.env.RESEND_API_KEY) return;

  const subject = `New LocalClaw Lead: ${data.name} — ${data.business}`;
  const body = `
NEW INTAKE SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:       ${data.name}
Email:      ${data.email}
Phone:      ${data.phone || "Not provided"}
Business:   ${data.business}
Industry:   ${data.industry || "Not specified"}
Team Size:  ${data.teamSize || "Not specified"}
Budget:     ${data.budget || "Not specified"}

Automations: ${Array.isArray(data.automations) ? (data.automations as string[]).join(", ") : "None selected"}

Details:
${data.details || "No additional details"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
View all leads: /admin
  `.trim();

  console.log(`📧 Sending alert to ${alertEmail}: ${subject}`);

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "LocalClaw <alerts@mail.localclawagents.com>",
    to: alertEmail,
    subject,
    text: body,
  });
}
