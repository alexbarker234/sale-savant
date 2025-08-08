import { getSteamAuthUrl } from "@/lib/steam-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const authUrl = getSteamAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to initiate Steam login" }, { status: 500 });
  }
}
