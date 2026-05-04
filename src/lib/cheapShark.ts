import { GameDeal } from "@/types";
import { CheapSharkGameListResponse } from "@/types/cheapShark";
import pkg from "../../package.json";

function logCheapShark429RetryAfter(response: Response, context: string): void {
  if (response.status !== 429) return;
  console.error(`CheapShark 429 (${context}). Retry-After:`, response.headers.get("Retry-After") ?? "(missing)");
}

async function cheapsharkFetch(url: string, context: string): Promise<Response> {
  const contact = process.env.SALESAVANT_UA_CONTACT?.trim();
  const userAgent =
    contact && contact.length > 0 ? `SaleSavant/${pkg.version} (${contact})` : `SaleSavant/${pkg.version}`;
  const response = await fetch(url, {
    headers: { "User-Agent": userAgent },
    next: { revalidate: 600 }
  });
  if (!response.ok) {
    logCheapShark429RetryAfter(response, context);
  }
  return response;
}

export class CheapShark {
  static async requestGameDeals(steamIDs: string[]): Promise<CheapSharkGameListResponse> {
    const apiUrl = (pageNum: number) =>
      `https://www.cheapshark.com/api/1.0/deals?storeID=11,1&sortBy=Title&steamAppID=${encodeURIComponent(
        steamIDs.join(",")
      )}&pageNumber=${pageNum}`;

    // Request from CheapShark
    const maxPages = await CheapShark.getMaxPages(apiUrl);
    const pagePromises = Array.from({ length: maxPages }, (_, pageNum) => CheapShark.fetchPage(apiUrl, pageNum));
    const fullResponse = (await Promise.all(pagePromises)).flat();

    // Format response
    const responseObj: CheapSharkGameListResponse = {};
    fullResponse.forEach((item) => {
      const { steamAppID, storeID, title, salePrice, normalPrice, steamRatingPercent, dealID, savings } = item;

      if (!responseObj[steamAppID]) {
        responseObj[steamAppID] = {
          title,
          salePrice,
          normalPrice,
          steamRatingPercent,
          steam: { salePrice: "0", normalPrice: "0", dealID: "", savings: "0" }
        };
      }

      const storeData = { salePrice, normalPrice, dealID, savings };

      if (storeID === "1") {
        responseObj[steamAppID]!.steam = storeData;
      } else if (storeID === "11") {
        responseObj[steamAppID]!.humble = storeData;
      }
    });

    return responseObj;
  }

  private static async fetchPage(apiUrl: (pageNum: number) => string, pageNum: number): Promise<GameDeal[]> {
    const response = await cheapsharkFetch(apiUrl(pageNum), `page ${pageNum}`);
    if (!response.ok) throw new Error(`Failed to fetch page ${pageNum}`);
    return response.json();
  }

  private static async getMaxPages(apiUrl: (pageNum: number) => string): Promise<number> {
    const response = await cheapsharkFetch(apiUrl(1), "max pages");
    if (!response.ok) throw new Error("Failed to fetch the first page");
    return parseInt(response.headers.get("X-Total-Page-Count") || "0", 10);
  }

  static async getHomePageDeals(): Promise<GameDeal[]> {
    try {
      const params = new URLSearchParams({
        storeID: "11,1",
        sortBy: "DealRating",
        desc: "true",
        pageNumber: "1",
        steamworks: "true",
        onSale: "true",
        steamRating: "75"
      });
      const response = await cheapsharkFetch(
        `https://www.cheapshark.com/api/1.0/deals?${params.toString()}`,
        "home page deals"
      );
      if (!response.ok) {
        const responseBody = await response.text();
        console.error("CheapShark API fetch error. Status:", response.status, "Body:", responseBody);

        throw new Error("Failed to fetch the first page");
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching home page deals:", error);
      return [];
    }
  }
}
