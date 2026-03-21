import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

function isAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get("lc_admin");
  return cookie?.value === process.env.ADMIN_PASSWORD;
}

interface CalBooking {
  id: number;
  uid: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  metadata?: { videoCallUrl?: string };
  responses?: {
    name?: string;
    email?: string;
    guests?: string[];
    location?: { value?: string };
  };
  location?: string;
  cancellationReason?: string | null;
}

interface NormalizedBooking {
  id: number;
  uid: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  attendeeName: string;
  attendeeEmail: string;
  videoUrl: string | null;
  location: string;
  cancellationReason: string | null;
  matchedLeadId: string | null;
  matchedLeadStatus: string | null;
}

async function fetchCalBookings(status: string): Promise<CalBooking[]> {
  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) return [];

  const res = await fetch(`https://api.cal.com/v2/bookings?status=${status}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    next: { revalidate: 0 },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data?.data?.bookings || [];
}

// GET — fetch all bookings + match with leads
export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all booking types in parallel
  const [upcoming, past, cancelled] = await Promise.all([
    fetchCalBookings("upcoming"),
    fetchCalBookings("past"),
    fetchCalBookings("cancelled"),
  ]);

  const allBookings = [...upcoming, ...past, ...cancelled];

  // Get all attendee emails to match with leads
  const attendeeEmails = allBookings
    .map(b => b.responses?.email?.toLowerCase())
    .filter(Boolean) as string[];

  // Fetch matching leads from Supabase
  let leadMap: Record<string, { id: string; status: string }> = {};
  if (attendeeEmails.length > 0) {
    const { data: leads } = await getSupabase()
      .from("intake_submissions")
      .select("id, email, status")
      .in("email", attendeeEmails);

    if (leads) {
      leads.forEach((l: { id: string; email: string; status: string }) => {
        leadMap[l.email.toLowerCase()] = { id: l.id, status: l.status };
      });
    }
  }

  // Normalize bookings
  function normalize(b: CalBooking): NormalizedBooking {
    const email = (b.responses?.email || "").toLowerCase();
    const matched = leadMap[email] || null;
    return {
      id: b.id,
      uid: b.uid,
      title: b.title,
      status: b.status,
      startTime: b.startTime,
      endTime: b.endTime,
      createdAt: b.createdAt,
      attendeeName: b.responses?.name || "Unknown",
      attendeeEmail: b.responses?.email || "",
      videoUrl: b.metadata?.videoCallUrl || null,
      location: b.location || "",
      cancellationReason: b.cancellationReason || null,
      matchedLeadId: matched?.id || null,
      matchedLeadStatus: matched?.status || null,
    };
  }

  return NextResponse.json({
    upcoming: upcoming.map(normalize),
    past: past.map(normalize),
    cancelled: cancelled.map(normalize),
    stats: {
      total: allBookings.length,
      upcoming: upcoming.length,
      past: past.length,
      cancelled: cancelled.length,
      matched: allBookings.filter(b => leadMap[(b.responses?.email || "").toLowerCase()]).length,
    },
  });
}

// POST — sync bookings: auto-update lead status to "call_booked" for matching leads
export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const upcoming = await fetchCalBookings("upcoming");
  const past = await fetchCalBookings("past");
  const allActive = [...upcoming, ...past];

  const emails = allActive
    .map(b => b.responses?.email?.toLowerCase())
    .filter(Boolean) as string[];

  if (emails.length === 0) {
    return NextResponse.json({ synced: 0 });
  }

  // Find leads that are "new" or "contacted" and have a booking
  const { data: leads } = await getSupabase()
    .from("intake_submissions")
    .select("id, email, status")
    .in("email", emails)
    .in("status", ["new", "contacted"]);

  let synced = 0;
  if (leads && leads.length > 0) {
    for (const lead of leads) {
      await getSupabase()
        .from("intake_submissions")
        .update({ status: "call_booked" })
        .eq("id", lead.id);
      synced++;
    }
  }

  return NextResponse.json({ synced });
}
