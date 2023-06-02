import type { NextApiRequest, NextApiResponse } from "next";
import { Steam } from "../../lib/steam";
import { WishlistItemResponse, ErrorResponse } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<WishlistItemResponse[] | ErrorResponse>) {
    const { query, method } = req
    if (!query.id) {
        res.status(400).json({error: "no id included"});
    }

    const id = query.id as string

    let response = await Steam.getUserWishlist(id)

    res.status(200).json(response);
}
