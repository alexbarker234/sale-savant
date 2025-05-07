import { SaleSavantUser } from "@/types";
import { SteamProfile, SteamWishlistItem, SteamWishlistResponse } from "@/types/steam";

export class Steam {
  private static readonly KEY = process.env.STEAM_KEY;

  static async resolveUserFromURL(userURL: string) {
    let username = userURL.startsWith("https://steamcommunity.com/id")
      ? userURL.match(/\/id\/(.+?)(\/|$)/)?.[1]
      : userURL;
    return username ? await this.resolveUserFromName(username) : null;
  }

  static async resolveUserFromName(username: string) {
    if (!this.KEY) throw new Error("STEAM_KEY not set");

    const apiUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${this.KEY}&vanityurl=${username}`;
    let resp = await fetch(apiUrl, { next: { revalidate: 600 } });
    let json = await resp.json();

    return json.response?.steamid;
  }

  static async getUserWishlist(userID: string): Promise<{ status: "success" | "error"; data: SteamWishlistItem[] }> {
    try {
      // why does this not require a key?
      const apiUrl = `https://api.steampowered.com/IWishlistService/GetWishlist/v1?steamid=${userID}`;
      const response: SteamWishlistResponse = await (await fetch(apiUrl)).json();

      // returns { response: {} } for private wishlists
      // check for empty object
      if (!response.response || Object.keys(response.response).length === 0) {
        return { status: "error", data: [] };
      }

      return { status: "success", data: response.response.items };
    } catch {
      return { status: "error", data: [] };
    }
  }
  static async getUser(userID: string): Promise<SaleSavantUser | undefined> {
    if (!this.KEY) throw new Error("STEAM_KEY not set");

    const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${this.KEY}&steamids=${userID}`;
    const response = await (await fetch(apiUrl)).json();
    const user: SteamProfile = response.response.players[0];
    return user
      ? {
          displayName: user.personaname,
          profileURL: user.profileurl,
          avatarURL: user.avatarfull,
          lastSeenTimestamp: user.lastlogoff
        }
      : undefined;
  }
}
