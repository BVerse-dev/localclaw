import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, checkAdminPassword, createAdminToken, isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

// GET — is the current session valid? (lets the dashboard restore a session on reload)
export async function GET(req: NextRequest) {
  return NextResponse.json({ authed: isAdminRequest(req) });
}

// POST — log in
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const token = createAdminToken();

    if (token && checkAdminPassword(password)) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(ADMIN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: ADMIN_SESSION_SECONDS,
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}

// DELETE — log out
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "strict", maxAge: 0, path: "/" });
  return response;
}
