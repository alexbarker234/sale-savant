import { Steam } from "@/lib/steam";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
        NextResponse.json({ error: "No id provided" }, { status: 400 });
        return;
    }

    let response = await Steam.getUser(id);

    return NextResponse.json(response ?? { error: true });
}
