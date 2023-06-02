import { CheapSharkResponse } from "@/types";

export class CheapShark {
    // TODO: check out the steamworks=true tag for the request to get ALL STORES that can redeem on steam
    static async requestHumbleGameDeals(steamIDs: string[]) {
        let fullResponse: any[] = [];

        //console.log('\n\n\n\n')
        const responseObj: CheapSharkResponse = { steamGames: {}, humbleGames: {} };

        // seems like theres some undocumented limit on the amount of ids that can be in a request
        const maxLength = 200;
        for (let i = 0; i < steamIDs.length; i += maxLength) {
            const idList = steamIDs.slice(i, i + maxLength);

            let pageNum = 0;
            let maxPages = 0;
            const apiUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=11,1&steamAppID=${idList.toString()}&pageNumber=`;

            do {
                //console.log(`requesting from ${apiUrl + pageNum}`)
                const main = await fetch(apiUrl + pageNum);
                const response = await main.json();
                if (response.error) {
                    console.error(response.error)
                    return responseObj;
                }
                maxPages = parseInt(main.headers.get("X-Total-Page-Count") || "0");
                fullResponse.push(...response);
                pageNum++;
            } while (pageNum <= maxPages);
        }
        // sort steam and humble
        fullResponse.forEach((item: any) => {
            if (item.storeID == "1") responseObj.steamGames[item.steamAppID] = item;
            else if (item.storeID == "11") responseObj.humbleGames[item.steamAppID] = item;
        });

        return responseObj;
    }
}
