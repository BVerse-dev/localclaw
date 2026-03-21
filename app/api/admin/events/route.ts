import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function isAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get("lc_admin");
  return cookie?.value === process.env.ADMIN_PASSWORD;
}

// GET — fetch payment events log
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const type = searchParams.get("type"); // filter by event_type

  let query = getSupabase()
    .from("payment_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (type) {
    query = query.eq("event_type", type);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also get summary counts
  const { data: allEvents } = await getSupabase()
    .from("payment_events")
    .select("event_type, status");

  const summary: Record<string, number> = {};
  const failures: Array<{ type: string; reason: string; email: string; created: string }> = [];

  (allEvents || []).forEach((e: { event_type: string; status: string }) => {
    summary[e.event_type] = (summary[e.event_type] || 0) + 1;
  });

  // Get recent failures specifically
  const { data: recentFailures } = await getSupabase()
    .from("payment_events")
    .select("event_type, failure_reason, email, created_at")
    .not("failure_reason", "is", null)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    events: data || [],
    summary,
    recentFailures: (recentFailures || []).map((f: { event_type: string; failure_reason: string; email: string; created_at: string }) => ({
      type: f.event_type,
      reason: f.failure_reason,
      email: f.email,
      created: f.created_at,
    })),
  });
}
