import { CheapShark } from "@/lib/cheapShark";
import { Steam } from "@/lib/steam";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return;

    if (!id) {
        NextResponse.json({ error: "no id included" }, {status: 400});
    }

    let steamResponse = await Steam.getUserWishlist(id);

    if ((steamResponse as SteamWishlistErrorResponse).success == 2) {
        let response = { error: "private profile" };
        NextResponse.json(response);
        return;
    }

    const steamIDs = Object.keys(steamResponse);
    const cheapSharkResponse = await CheapShark.requestGameDeals(steamIDs);

    let response: WishlistResponse = {};

    for (let steamID in steamResponse) {
        const wishlistItem = (steamResponse as SteamWishlistResponse)[steamID];
        const steam = cheapSharkResponse.steamGames[steamID];
        const humble = cheapSharkResponse.humbleGames[steamID];
        response[steamID] = {
            gameName: wishlistItem.name,
            imageURL: wishlistItem.capsule,
            steamDeal: steam && {
                currentPrice: +steam.salePrice,
                originalPrice: +steam.normalPrice,
                discountPercent: parseInt(steam.savings),
                dealID: steam.dealID,
            },
            humbleDeal: humble && {
                currentPrice: +humble.salePrice,
                originalPrice: +humble.normalPrice,
                discountPercent: parseInt(humble.savings),
                dealID: humble.dealID,
            },
            maxDiscount: Math.max(parseInt(steam?.savings) ?? 0, parseInt(humble?.savings) ?? 0),
            priority: wishlistItem.priority == 0 ? Number.MAX_SAFE_INTEGER : wishlistItem.priority, // 0 priority items are NO priority TODO: find a better way (probably in the sort)
            isReleased: !wishlistItem.prerelease,
            review:  wishlistItem.reviews_percent,
            show: true,
            platforms: wishlistItem.platform_icons.match(/class="([^>]*)">/g)?.map((platform) => platform.slice(7, -2).split(" ")[1]),
        };
    }
    return NextResponse.json(response);
}