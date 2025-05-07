export type SaltSavantWishlistItem = {
  id: string;
};

export type SaleSavantUser = {
  displayName: string;
  profileURL: string;

  avatarURL: string;
  lastSeenTimestamp: number;
};

export type WishlistResponse = {
  [key: string]: WishlistItem;
};
export type WishlistItem = {
  gameName: string;
  imageURL: string;

  steamDeal?: Deal;
  humbleDeal?: Deal;

  maxDiscount: number;

  priority: number;

  show: boolean;

  review: number;
  platforms?: string[];
};
export type Deal = {
  currentPrice: number;
  originalPrice: number;
  discountPercent: number;
  dealID: string;
};

export type ErrorResponse = {
  error: string;
};
