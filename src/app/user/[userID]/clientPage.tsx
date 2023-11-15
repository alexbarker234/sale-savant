"use client";

import UserInfo from "./userInfo";
import Wishlist from "./wishlist";

export default function ClientPage({ userId, userData }: { userId: string; userData: SteamUser }) {
    return (
        <>
            <UserInfo userData={userData} />
            <Wishlist userID={userId} />
        </>
    );
}
