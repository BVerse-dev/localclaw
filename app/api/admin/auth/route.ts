import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password === process.env.ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      // Set a simple auth cookie (httpOnly, secure, 24hr expiry)
      response.cookies.set("lc_admin", process.env.ADMIN_PASSWORD!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
