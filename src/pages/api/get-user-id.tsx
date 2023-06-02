import type { NextApiRequest, NextApiResponse } from "next";
import { Steam } from "../../lib/steam";
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query, method } = req
    const url = query.url as string

    let response = await Steam.resolveUserFromURL(url)

    res.status(200).json({id: response});
}
