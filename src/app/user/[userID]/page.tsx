import { SteamUser } from "@/types";
import UserInfo from "./userInfo";
import Wishlist from "./wishlist";
import { use } from "react";

export default function Home({ params }: any) {
    console.log(`${process.env.URL}/api/get-user-details?id=${params.userID}`);
    const data: SteamUser = use(use(fetch(`${process.env.URL}/api/get-user-details?id=${params.userID}`, { next: { revalidate: 600 } })).json());

    return (
        <>
            <title>{`${data.displayName}'s Wishlist`}</title>
            <UserInfo userData={data} />
            <Wishlist userID={params.userID} />
        </>
    );
}
