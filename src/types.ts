// SALE SAVANT API

// wishlists
interface WishlistResponse {
    [key: string]: WishlistItem;
}
interface WishlistItem {
    gameName: string;
    imageURL: string;

    steamDeal?: Deal;
    humbleDeal?: Deal;

    maxDiscount: number;

    priority: number;
    isReleased: boolean;

    show: boolean;

    review: number;
    platforms?: string[];
}
interface Deal {
    currentPrice: number;
    originalPrice: number;
    discountPercent: number;
    dealID: string;
}

interface SteamUser {
    displayName: string;
    profileURL: string;

    avatarURL: string;
    lastSeenTimestamp: number;
}

// STEAM API
type SteamWishlistResponse = Partial<Record<string, SteamWishlistItemResponse>>;
interface SteamWishlistErrorResponse {
    success: number;
}

interface SteamWishlistItemResponse {
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

interface Sub {
    discount_block: string;
    discount_pct: number;
    price: string;
}

// CHEAPSHARK API
interface CheapSharkResponse {
    steamGames: CheapSharkGameListResponse;
    humbleGames: CheapSharkGameListResponse;
}
type CheapSharkGameListResponse = Partial<
    Record<string, CheapSharkGameResponse>
>;

interface CheapSharkGameResponse {
    title: string;
    salePrice: string;
    normalPrice: string;
    savings: string;
    dealID: string;
}

// MISC
interface ErrorResponse {
    error: string;
}
