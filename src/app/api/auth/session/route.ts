import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    return NextResponse.json({
      user: session.user || null,
      isLoggedIn: session.isLoggedIn || false
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
  }
}
