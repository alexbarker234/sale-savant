import UserInfo from "./userInfo";
import Wishlist from "./wishlist";
import { use } from "react";
import { redirect } from 'next/navigation';

export default function Home({ params }: any) {
    const data= use(use(fetch(`${process.env.URL}/api/get-user-details?id=${params.userID}`, { next: { revalidate: 600 } })).json());

    if (data.error) {
        redirect('/')
    }

    return (
        <>
            <title>{`Sale Savant - ${data.displayName}'s Wishlist`}</title>
            <UserInfo userData={data} />
            <Wishlist userID={params.userID} />
        </>
    );
}
