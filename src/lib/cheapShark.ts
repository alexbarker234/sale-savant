interface GameDeal {
    internalName: string;
    title: string;
    metacriticLink: string;
    dealID: string;
    storeID: string;
    gameID: string;
    salePrice: string;
    normalPrice: string;
    isOnSale: string;
    savings: string;
    metacriticScore: string;
    steamRatingText: string;
    steamRatingPercent: string;
    steamRatingCount: string;
    steamAppID: string;
    releaseDate: number;
    lastChange: number;
    dealRating: string;
    thumb: string;
}

export class CheapShark {
    static async requestGameDeals(steamIDs: string[]): Promise<CheapSharkResponse> {
        const apiUrl = (pageNum: number) =>
            `https://www.cheapshark.com/api/1.0/deals?storeID=11,1&sortBy=Title&steamAppID=${encodeURIComponent(
                steamIDs.join(",")
            )}&pageNumber=${pageNum}`;

        const fullResponse: GameDeal[] = [];

        const maxPages = await CheapShark.getMaxPages(apiUrl);

        await Promise.all(
            Array.from({ length: maxPages }, (_, pageNum) => CheapShark.fetchPage(apiUrl, pageNum, fullResponse))
        );

        // sort steam and humble
        const responseObj: CheapSharkResponse = { steamGames: {}, humbleGames: {} };
        fullResponse.forEach((item) => {
            if (item.storeID === "1") responseObj.steamGames[item.steamAppID] = item;
            else if (item.storeID === "11") responseObj.humbleGames[item.steamAppID] = item;
        });

        return responseObj;
    }

    private static async fetchPage(apiUrl: (pageNum: number) => string, pageNum: number, fullResponse: GameDeal[]) {
        const main = await fetch(apiUrl(pageNum), { next: { revalidate: 600 } });
        const response: GameDeal[] = await main.json();
        fullResponse.push(...response);
    }

    private static async getMaxPages(apiUrl: (pageNum: number) => string): Promise<number> {
        const firstPage = await fetch(apiUrl(1), { next: { revalidate: 600 } });
        return parseInt(firstPage.headers.get("X-Total-Page-Count") || "0", 10);
    }
}
