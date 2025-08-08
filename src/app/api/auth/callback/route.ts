import { getSession } from "@/lib/session";
import { getSteamUserInfo, validateSteamOpenIdResponse } from "@/lib/steam-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Validate Steam OpenID response
    const steamId = await validateSteamOpenIdResponse(searchParams);

    // Get additional user info from Steam API
    const userInfo = await getSteamUserInfo(steamId);

    // Create session
    const session = await getSession();
    session.user = userInfo;
    session.isLoggedIn = true;
    await session.save();

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(new URL("/auth/error?error=callback_failed", request.url));
  }
}
