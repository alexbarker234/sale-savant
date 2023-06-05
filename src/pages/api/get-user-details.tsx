import type { NextApiRequest, NextApiResponse } from "next";
import { Steam } from "../../lib/steam";
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query, method } = req;
    if (!query.id) {
        res.status(400).json({ error: "no id included" });
    }

    const id = query.id as string;

    let response = await Steam.getUser(id)

    res.status(200).json(response ?? {error: true});
}
