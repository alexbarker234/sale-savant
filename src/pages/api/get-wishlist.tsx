import type { NextApiRequest, NextApiResponse } from "next";
import { Steam } from "../../lib/steam";
import { CheapShark } from "@/lib/cheapShark";
import { SteamWishlistItemResponse, ErrorResponse, SteamWishlistResponse, WishlistResponse, CheapSharkResponse, SteamWishlistErrorResponse } from "@/types";
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
            game_name: wishlistItem.name,
            image_url: wishlistItem.capsule,
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
            priority: wishlistItem.priority == 0 ? 9999 : wishlistItem.priority, // 0 priority items are NO priority TODO: find a better way (probably in the sort)
            is_released: !wishlistItem.prerelease,
        };
    }
    ssrCache.set(id, response);
    res.setHeader("x-cache", "MISS");
    res.status(200).json(response);
}
