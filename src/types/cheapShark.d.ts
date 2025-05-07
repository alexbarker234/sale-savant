export type ProcessedCheapSharkGame = {
  title: string;
  salePrice: string;
  normalPrice: string;

  steamRatingPercent: string;

  steam: {
    salePrice: string;
    normalPrice: string;
    dealID: string;
    savings: string;
  };

  humble?: {
    salePrice: string;
    normalPrice: string;
    dealID: string;
    savings: string;
  };
};

export type CheapSharkGameListResponse = Partial<Record<string, ProcessedCheapSharkGame>>;

export type CheapSharkGame = {
  title: string;
  salePrice: string;
  normalPrice: string;
  savings: string;
  dealID: string;
  steamRatingPercent: string;
};
