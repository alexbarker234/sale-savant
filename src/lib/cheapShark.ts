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

    const responseObj: CheapSharkResponse = { steamGames: {}, humbleGames: {} };

    const maxPages = await CheapShark.getMaxPages(apiUrl);
    const pagePromises = Array.from({ length: maxPages }, (_, pageNum) => CheapShark.fetchPage(apiUrl, pageNum));

    const fullResponse = (await Promise.all(pagePromises)).flat();

    fullResponse.forEach((item) => {
      if (item.storeID === "1") responseObj.steamGames[item.steamAppID] = item;
      else if (item.storeID === "11") responseObj.humbleGames[item.steamAppID] = item;
    });

    return responseObj;
  }

  private static async fetchPage(apiUrl: (pageNum: number) => string, pageNum: number): Promise<GameDeal[]> {
    const response = await fetch(apiUrl(pageNum), { next: { revalidate: 600 } });
    if (!response.ok) throw new Error(`Failed to fetch page ${pageNum}`);
    return response.json();
  }

  private static async getMaxPages(apiUrl: (pageNum: number) => string): Promise<number> {
    const response = await fetch(apiUrl(1), { next: { revalidate: 600 } });
    if (!response.ok) throw new Error("Failed to fetch the first page");
    return parseInt(response.headers.get("X-Total-Page-Count") || "0", 10);
  }
}
