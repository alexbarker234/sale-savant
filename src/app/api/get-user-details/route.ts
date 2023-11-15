import { Steam } from "@/lib/steam";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("\tget-user-details request!")


    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    console.log(id)
    if (!id) {
        const response: ErrorResponse = { error: "No id provided" };
        return NextResponse.json(response, { status: 400 });
    }
    console.log(`searching for steam user ${id}`)
    let steamUser = await Steam.getUser(id);
    console.log(steamUser)
    if (!steamUser) {
        const response: ErrorResponse = { error: "No user found" };
        return NextResponse.json(response, { status: 404 });
    }

    const response: SteamUser = steamUser;
    return NextResponse.json(response);
}
