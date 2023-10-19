import type { NextApiRequest, NextApiResponse } from "next";
import { Steam } from "../../lib/steam";
import { CheapShark } from "@/lib/cheapShark";
import { ErrorResponse, SteamWishlistResponse, WishlistResponse, SteamWishlistErrorResponse } from "@/types";
import { LRUCache } from "lru-cache";

const ssrCache = new LRUCache({
    max: 20,
    ttl: 1000 * 60 * 10,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<WishlistResponse | ErrorResponse>) {
    const { query, method } = req;
    if (!query.id) {
        res.status(400).json({ error: "no id included" });
    }

    const id = query.id as string;

    // if page is in cache, server from cache
    if (ssrCache.has(id)) {
        console.info(`returning cached wishlist for ${id}`);
        res.setHeader("x-cache", "HIT");

        res.status(200).json(ssrCache.get(id) || { error: "cache error" });
        return;
    }

    let steamResponse = await Steam.getUserWishlist(id);

    if ((steamResponse as SteamWishlistErrorResponse).success == 2) {
        // not caching here
        let response = { error: "private profile" };
        res.status(200).json(response);
        return;
    }

    const steamIDs = Object.keys(steamResponse);
    const cheapSharkResponse = await CheapShark.requestHumbleGameDeals(steamIDs);

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
    ssrCache.set(id, response);
    res.setHeader("x-cache", "MISS");
    res.status(200).json(response);
}
