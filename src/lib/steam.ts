import { SteamUser } from "@/types";

// steam really does just have awful naming

export class Steam {
    private static readonly KEY = process.env.STEAM_KEY;

    static async resolveUserFromURL(userURL: string) {
        let username = userURL.match(/\/id\/(.+?)(\/|$)/)?.[1];
        return username ? await this.resolveUserFromName(username) : null;
    }

    static async resolveUserFromName(username: string) {
        const apiUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${this.KEY}&vanityurl=${username}`;

        let resp = await fetch(apiUrl);
        let json = await resp.json();

        return json.response?.steamid;
    }

    static async getUserWishlist(userID: string) {
        const apiUrl = `https://store.steampowered.com/wishlist/profiles/${userID}/wishlistdata/?p=0`;
        return await (await fetch(apiUrl)).json();
    }
    static async getUser(userID: string): Promise<SteamUser | undefined> {
        const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${this.KEY}&steamids=${userID}`;
        const response = await (await fetch(apiUrl)).json();
        const user = response.response.players[0]
        return user ? {
            displayName: user.personaname,
            profileURL: user.profileurl,          
            avatarURL: user.avatarfull,
            lastSeenTimestamp: user.lastlogoff,
        } : undefined;
    }
}
