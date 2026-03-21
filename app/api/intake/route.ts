import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, business, industry, teamSize, budget, automations, details } = body;

    // Validate required fields
    if (!name || !email || !business) {
      return NextResponse.json({ error: "Name, email, and business are required." }, { status: 400 });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("intake_submissions")
      .insert({
        name,
        email,
        business,
        industry: industry || null,
        team_size: teamSize || null,
        budget: budget || null,
        automations: automations || [],
        details: details || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save submission." }, { status: 500 });
    }

    // Send email alert (fire-and-forget — don't block the response)
    sendEmailAlert({ name, email, business, industry, teamSize, budget, automations, details }).catch(
      (err) => console.error("Email alert failed:", err)
    );

    return NextResponse.json({ success: true, id: data.id }, { status: 200 });
  } catch (err) {
    console.error("Intake API error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ── Email alert via Supabase Edge Function or simple log ──────────────────────
// For now, this logs the alert. When you add Resend (free tier, 100/day):
// 1. npm install resend
// 2. Add RESEND_API_KEY to .env.local
// 3. Uncomment the Resend block below
async function sendEmailAlert(data: Record<string, unknown>) {
  const alertEmail = process.env.ALERT_EMAIL;
  if (!alertEmail) return;

  // Format the alert
  const subject = `New LocalClaw Lead: ${data.name} — ${data.business}`;
  const body = `
NEW INTAKE SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:       ${data.name}
Email:      ${data.email}
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

  // Log for now (visible in your server/Vercel logs)
  console.log(`\n📧 EMAIL ALERT TO: ${alertEmail}\n📋 ${subject}\n${body}\n`);

  // ── Uncomment when Resend is set up ──
  // const { Resend } = await import("resend");
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "LocalClaw <alerts@localclawagents.com>",
  //   to: alertEmail,
  //   subject,
  //   text: body,
  // });
}
