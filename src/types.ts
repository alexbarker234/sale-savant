// SALE SAVANT API

// wishlists
export interface WishlistResponse {
    [key: string]: WishlistItemResponse;
}
export interface WishlistItemResponse {
    game_name: string;
    image_url: string;

    steamDeal?: Deal;
    humbleDeal?: Deal;

    priority: number;
    is_released: boolean;

    review: number
    platforms?: string[]
}
export interface Deal {
    currentPrice: number;
    originalPrice: number;
    discountPercent: number;
    dealID: string;
}
// steam
export interface SteamUser {
    displayName: string;
    profileURL: string;

    avatarURL: string;
    lastSeenTimestamp: number;
}

// STEAM
export interface SteamWishlistResponse {
    [key: string]: SteamWishlistItemResponse;
}
export interface SteamWishlistErrorResponse {
    success: number;
}

export interface SteamWishlistItemResponse {
    name: string;
    capsule: string;
    /** length 0 for unreleased games. 1 for released games. */
    // Not sure if there are other situations - bundles perhaps
    subs: Sub[];
    type: string;
    priority: number;
    prerelease?: number; // wow
    reviews_percent: number;
    platform_icons: string;
}

export interface Sub {
    discount_block: string;
    discount_pct: number;
    price: string;
}

// CHEAPSHARK
export interface CheapSharkResponse {
    steamGames: CheapSharkGameListResponse;
    humbleGames: CheapSharkGameListResponse;
}
export interface CheapSharkGameListResponse {
    [key: string]: CheapSharkGameResponse;
}

export interface CheapSharkGameResponse {
    title: string;
    salePrice: string;
    normalPrice: string;
    savings: string;
    dealID: string;
}

// MISC
export interface ErrorResponse {
    error: string;
}
