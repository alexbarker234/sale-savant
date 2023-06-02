export class Steam {
    private static readonly KEY = process.env.STEAM_KEY;

    static async resolveUserFromURL(userURL: string) {
        let username = userURL.match(/\/id\/(.+?)(\/|$)/)?.[1];
        return username ? await this.resolveUserFromName(username) : null
    }

    static async resolveUserFromName(username: string) {
        const apiUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${this.KEY}&vanityurl=${username}`;

        let resp = await fetch(apiUrl)
        let json = await resp.json()

        return json.response?.steamid
    }

    static async getUserWishlist(userID: string) {
        const apiUrl = `https://store.steampowered.com/wishlist/profiles/${userID}/wishlistdata/?p=0`;

        let resp = await fetch(apiUrl)
        let json = await resp.json()

        return json
    }
}