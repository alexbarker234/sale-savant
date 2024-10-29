import { CheapShark } from "@/lib/cheapShark";
import { Steam } from "@/lib/steam";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    let response: ErrorResponse = { error: "no id included" };
    return NextResponse.json(response, { status: 400 });
  }

  // this is what we get for using a private api :)
  const steamResponse = await Steam.getUserWishlist(id);
  const wishlist = steamResponse.data;
  if (steamResponse.status == "error") {
    let response: ErrorResponse = { error: "private profile" };
    return NextResponse.json(response, { status: 401 });
  }
  const steamIDs = Object.keys(wishlist);
  const cheapSharkResponse = await CheapShark.requestGameDeals(steamIDs);

  const response: WishlistResponse = {};

  for (let steamID in wishlist) {
    const wishlistItem = wishlist[steamID];
    if (!wishlistItem) continue;

    const steam = cheapSharkResponse.steamGames[steamID];
    const humble = cheapSharkResponse.humbleGames[steamID];
    response[steamID] = {
      gameName: wishlistItem.name,
      imageURL: wishlistItem.capsule,
      steamDeal: steam && {
        currentPrice: +steam.salePrice,
        originalPrice: +steam.normalPrice,
        discountPercent: parseInt(steam.savings),
        dealID: steam.dealID
      },
      humbleDeal: humble && {
        currentPrice: +humble.salePrice,
        originalPrice: +humble.normalPrice,
        discountPercent: parseInt(humble.savings),
        dealID: humble.dealID
      },
      maxDiscount: Math.max(+(steam?.savings ?? 0), +(humble?.savings ?? 0)),
      priority: wishlistItem.priority == 0 ? Number.MAX_SAFE_INTEGER : wishlistItem.priority, // 0 priority items are NO priority TODO: find a better way (probably in the sort)
      isReleased: !wishlistItem.prerelease,
      review: wishlistItem.reviews_percent,
      show: true,
      platforms: wishlistItem.platform_icons
        .match(/class="([^>]*)">/g)
        ?.map((platform) => platform.slice(7, -2).split(" ")[1])
    };
  }
  return NextResponse.json(response);
}
