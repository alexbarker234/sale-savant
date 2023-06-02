import type { NextApiRequest, NextApiResponse } from "next";
import { Steam } from "../../lib/steam";
import { CheapShark } from "@/lib/cheapShark";
import { SteamWishlistItemResponse, ErrorResponse, SteamWishlistResponse, WishlistResponse, CheapSharkResponse } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<WishlistResponse | ErrorResponse>) {
    const { query, method } = req;
    if (!query.id) {
        res.status(400).json({ error: "no id included" });
    }

    const id = query.id as string;

    let steamResponse: SteamWishlistResponse = await Steam.getUserWishlist(id);

    const steamIDs = Object.keys(steamResponse);
    const cheapSharkResponse = await CheapShark.requestHumbleGameDeals(steamIDs);
    //const cheapSharkResponse : CheapSharkResponse = { steamGames: {}, humbleGames: {} };

    let response: WishlistResponse = {};

    for (let steamID in steamResponse) {
        const wishlistItem = steamResponse[steamID];
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
            priority: wishlistItem.priority,
            is_released: !wishlistItem.prerelease,
        };
    }
    res.status(200).json(response);
}
