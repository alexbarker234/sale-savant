import { CheapSharkResponse } from "@/types";

export class CheapShark {
    // TODO: check out the steamworks=true tag for the request to get ALL STORES that can redeem on steam
    static async requestHumbleGameDeals(steamIDs: string[]) {
        let fullResponse: any[] = [];

        // without &sortBy=Title - games seem to be missing from the request

        let pageNum = 0;
        let maxPages = 0;
        const apiUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=11,1&sortBy=Title&steamAppID=${steamIDs.toString()}&pageNumber=`;

        do {
            const main = await fetch(apiUrl + pageNum);
            const response = await main.json();
            maxPages = parseInt(main.headers.get("X-Total-Page-Count") || "0");
            fullResponse.push(...response);
            pageNum++;
        } while (pageNum <= maxPages);

        // sort steam and humble
        const responseObj: CheapSharkResponse = { steamGames: {}, humbleGames: {} };
        fullResponse.forEach((item: any) => {
            if (item.storeID == "1") responseObj.steamGames[item.steamAppID] = item;
            else if (item.storeID == "11") responseObj.humbleGames[item.steamAppID] = item;
        });

        return responseObj;
    }
}
