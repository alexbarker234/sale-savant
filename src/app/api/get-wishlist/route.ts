import { CheapShark } from "@/lib/cheapShark";
import { Steam } from "@/lib/steam";
import { ErrorResponse, WishlistResponse } from "@/types/saleSavant";
import { NextResponse } from "next/server";

async function fetchWishlistData(id: string) {
  const steamResponse = await Steam.getUserWishlist(id);
  // TODO return errors with codes instead of strings
  if (steamResponse.status == "error") {
    let response: ErrorResponse = { error: "private profile" };
    return NextResponse.json(response, { status: 401 });
  }

  const wishlist = steamResponse.data;
  const steamIDs = wishlist.map((item) => item.appid.toString());
  const cheapSharkResponse = await CheapShark.requestGameDeals(steamIDs);
  console.log(cheapSharkResponse);
  const response: WishlistResponse = {};

  for (let wishlistItem of wishlist) {
    const steamID = wishlistItem.appid.toString();
    if (!wishlistItem) continue;

    const cheapSharkGame = cheapSharkResponse[steamID];

    if (!cheapSharkGame) {
      console.error(`Game ${steamID} not found in cheap shark response`);
      continue;
    }
    response[steamID] = {
      gameName: cheapSharkGame.title,
      imageURL: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${wishlistItem.appid}/header.jpg`,
      steamDeal: {
        currentPrice: +cheapSharkGame.steam.salePrice,
        originalPrice: +cheapSharkGame.steam.normalPrice,
        discountPercent: parseInt(cheapSharkGame.steam.savings),
        dealID: cheapSharkGame.steam.dealID
      },
      humbleDeal: cheapSharkGame.humble && {
        currentPrice: +cheapSharkGame.humble.salePrice,
        originalPrice: +cheapSharkGame.humble.normalPrice,
        discountPercent: parseInt(cheapSharkGame.humble.savings),
        dealID: cheapSharkGame.humble.dealID
      },
      maxDiscount: Math.max(+cheapSharkGame.steam.savings, +(cheapSharkGame.humble?.savings ?? 0)),
      priority: wishlistItem.priority == 0 ? Number.MAX_SAFE_INTEGER : wishlistItem.priority, // 0 priority items are NO priority TODO: find a better way (probably in the sort)
      review: +cheapSharkGame.steamRatingPercent,
      show: true
    };
  }
  return response;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      let response: ErrorResponse = { error: "no id included" };
      return NextResponse.json(response, { status: 400 });
    }

    const response = await fetchWishlistData(id);
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Failed to fetch the users wishlist" }, { status: 500 });
  }
}
