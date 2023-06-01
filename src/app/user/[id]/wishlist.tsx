"use client";
import React, { useState, useEffect } from "react";
import { WishlistItem } from "@/types";

interface WishlistProp {
    id: string;
}

const Wishlist = ({ id }: WishlistProp) => {
    const [data, setData] = useState<WishlistItem[]>();

    // keep up to date with https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#use-in-client-components
    // fetch cant be done in use safely yet but it will be useful :) 
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/get-wishlist?id=${id}`);
            const data: WishlistItem[] = await res.json();

            setData(data);
        };

        fetchData();
    }, [id]);

    return <p>{JSON.stringify(data)}</p>;
};
export default Wishlist;
