export class CheapShark {
    // TODO: check out the steamworks=true tag for the request to get ALL STORES that can redeem on steam
    static async requestHumbleGameDeals(steamIDs: string[]) {
        let fullResponse: any[] = [];

        const responseObj: CheapSharkResponse = { steamGames: {}, humbleGames: {} };

        let pageNum = 0;
        let maxPages = 0;
        // must sort by title - large lists with cheapshark have a problem with not returning all the deals/games if not sorted
        // there may still be a chance of missing games
        const apiUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=11,1&sortBy=Title&steamAppID=${steamIDs.toString()}&pageNumber=`;

        do {
            //console.log(`requesting from ${apiUrl + pageNum}`);
            const main = await fetch(apiUrl + pageNum);
            const response = await main.json();
            if (response.error) {
                console.error(response.error);
                return responseObj;
            }
            maxPages = parseInt(main.headers.get("X-Total-Page-Count") || "0");
            fullResponse.push(...response);
            pageNum++;
        } while (pageNum <= maxPages);

        // sort steam and humble
        fullResponse.forEach((item: any) => {
            if (item.storeID == "1") responseObj.steamGames[item.steamAppID] = item;
            else if (item.storeID == "11") responseObj.humbleGames[item.steamAppID] = item;
        });

        return responseObj;
    }
}
