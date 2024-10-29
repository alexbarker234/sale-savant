// steam really does just have awful naming
interface SteamProfile {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  commentpermission: number;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: number;
  realname: string;
  primaryclanid: string;
  timecreated: number;
  personastateflags: number;
  loccountrycode: string;
  locstatecode: string;
}

export class Steam {
  private static readonly KEY = process.env.STEAM_KEY;

  static async resolveUserFromURL(userURL: string) {
    let username = userURL.startsWith("https://steamcommunity.com/id")
      ? userURL.match(/\/id\/(.+?)(\/|$)/)?.[1]
      : userURL;
    return username ? await this.resolveUserFromName(username) : null;
  }

  static async resolveUserFromName(username: string) {
    const apiUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${this.KEY}&vanityurl=${username}`;
    let resp = await fetch(apiUrl, { next: { revalidate: 600 } });
    let json = await resp.json();

    return json.response?.steamid;
  }

  static async getUserWishlist(userID: string): Promise<{ status: "success" | "error"; data: SteamWishlistResponse }> {
    try {
      const finalResponse = {};
      const apiUrl = `https://store.steampowered.com/wishlist/profiles/${userID}/wishlistdata/?p=`;
      let response: any;
      let page = 0;
      do {
        response = await (await fetch(apiUrl + page, { next: { revalidate: 600 } })).json();
        if ("success" in response) return { status: "error", data: {} };

        Object.assign(finalResponse, response);
        page++;
      } while (Object.keys(response).length > 0);
      return { status: "success", data: finalResponse };
    } catch {
      return { status: "error", data: {} };
    }
  }
  static async getUser(userID: string): Promise<SteamUser | undefined> {
    const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${this.KEY}&steamids=${userID}`;
    console.log(apiUrl);
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
