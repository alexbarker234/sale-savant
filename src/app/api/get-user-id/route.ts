import { Steam } from "@/lib/steam";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    if (!url)
    {
        NextResponse.json({ error: "No url provided" }, { status: 400 });
        return;
    }

    let response = await Steam.resolveUserFromURL(url)

    return NextResponse.json({exists: response ? true : false, id: response});
}