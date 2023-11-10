import UserInfo from "./userInfo";
import Wishlist from "./wishlist";
import { use } from "react";
import { redirect } from 'next/navigation';
import { Steam } from "@/lib/steam";

export default function Home({ params }: any) {
    const data = use(Steam.getUser(params.userID));
    if (!data) redirect('/')

    return (
        <>
            <title>{`Sale Savant - ${data.displayName}'s Wishlist`}</title>
            <UserInfo userData={data} />
            <Wishlist userID={params.userID} />
        </>
    );
}
