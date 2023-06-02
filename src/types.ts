// API

export interface WishlistResponse {
    [key: string]: WishlistItemResponse;
}
export interface WishlistItemResponse {
    game_name: string;
    image_url: string;
    
    steamDeal: Deal
    humbleDeal: Deal | undefined

    priority: number;
    is_released: boolean
}
export interface Deal {
    currentPrice: number
    originalPrice: number
    discountPercent: number
}
// STEAM
export interface SteamWishlistResponse {
    [key: string]: SteamWishlistItemResponse;
}

export interface SteamWishlistItemResponse {
    name: string;
    capsule: string;
    /** length 0 for unreleased games. 1 for released games. */
    // Not sure if there are other situations - bundles perhaps
    subs: Sub[];
    type: string;
    priority: number;
    prerelease: number | undefined; // wow
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
}

// MISC
export interface ErrorResponse {
    error: string;
}