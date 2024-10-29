"use client";

import { useState } from "react";
import UserInfo, { GameCount } from "./userInfo";
import Wishlist from "./wishlist";

export default function ClientPage({ userId, userData }: { userId: string; userData: SteamUser }) {
  const [gameCount, setGameCount] = useState<GameCount>({ saleCount: -1, gameCount: -1 });

  return (
    <>
      <UserInfo userData={userData} gameCount={gameCount} />
      <Wishlist userID={userId} setGameCount={setGameCount} />
    </>
  );
}
