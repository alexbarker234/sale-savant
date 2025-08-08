import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    session.destroy();

    // Create response with cache-busting headers
    const response = NextResponse.redirect(new URL("/", request.url));

    // Add headers to force refresh and clear cache
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/auth/error?error=logout_failed", request.url));
  }
}
