"use client";
import { WishlistItem } from "@/types";

interface WishlistProp {
    id: string;
}

const Wishlist = async ({ id }: WishlistProp) => {
    // keep up to date with https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#use-in-client-components
    // fetch cant be done in use safely yet but it will be useful :)
    const res = await fetch(`/api/get-wishlist?id=${id}`);

    const data = await res.json()
    console.log(data)

    return <p>{JSON.stringify(data)}</p>;
};
export default Wishlist;
