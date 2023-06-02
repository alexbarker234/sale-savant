export interface WishlistResponse {
    [key: string]: WishlistItemResponse;
  }
  
export interface WishlistItemResponse {
    name: string;
    capsule: string;
    subs: Sub[];
    type: string;
    priority: number;
}

export interface Sub {
    discount_block: string;
    discount_pct: number;
    price: string;
}

export interface ErrorResponse {
    error: string;
}
