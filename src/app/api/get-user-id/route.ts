import { Steam } from "@/lib/steam";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    const response = { error: "No url provided" };
    return NextResponse.json(response, { status: 400 });
  }

  let steamUserId = await Steam.resolveUserFromURL(url);
  if (!steamUserId) {
    const response = { error: "No user found" };
    return NextResponse.json(response, { status: 404 });
  }

  const response = { id: steamUserId };
  return NextResponse.json(response);
}
