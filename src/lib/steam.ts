import { SteamUser, SteamWishlistErrorResponse, SteamWishlistResponse } from "@/types";

// steam really does just have awful naming

export class Steam {
    private static readonly KEY = process.env.STEAM_KEY;

    static async resolveUserFromURL(userURL: string) {
        let username = userURL.startsWith("https://steamcommunity.com/id") ? userURL.match(/\/id\/(.+?)(\/|$)/)?.[1] : userURL;
        return username ? await this.resolveUserFromName(username) : null;
    }

    static async resolveUserFromName(username: string) {
        const apiUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${this.KEY}&vanityurl=${username}`;

        let resp = await fetch(apiUrl);
        let json = await resp.json();

        return json.response?.steamid;
    }

    static async getUserWishlist(userID: string): Promise<SteamWishlistResponse | SteamWishlistErrorResponse> {
        const finalResponse = {};
        const apiUrl = `https://store.steampowered.com/wishlist/profiles/${userID}/wishlistdata/?p=`;
        let response: any;
        let page = 0;
        do {
            response = await (await fetch(apiUrl + page)).json();
            Object.assign(finalResponse, response);
            page++;
        } while (Object.keys(response).length > 0);
        return finalResponse;
    }
    static async getUser(userID: string): Promise<SteamUser | undefined> {
        const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${this.KEY}&steamids=${userID}`;
        const response = await (await fetch(apiUrl)).json();
        const user = response.response.players[0];
        return user
            ? {
                  displayName: user.personaname,
                  profileURL: user.profileurl,
                  avatarURL: user.avatarfull,
                  lastSeenTimestamp: user.lastlogoff,
              }
            : undefined;
    }
}
