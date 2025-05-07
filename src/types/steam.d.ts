// steam really does just have awful naming & docs

export interface SteamProfile {
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

export interface SteamWishlistItem {
  appid: number;
  priority: number;
  date_added: number;
}

export interface SteamWishlistResponse {
  response: {
    items: SteamWishlistItem[];
  };
}
