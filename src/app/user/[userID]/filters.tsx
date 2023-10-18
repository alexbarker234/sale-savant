"use client";

import React, { useEffect, useState } from "react";
import styles from "./filters.module.scss";
import wishlistItemStyles from "./wishlistItem.module.scss";
import { WishlistItemResponse } from "@/types";

interface FilterProps {
    wishlistItems: WishlistItemResponse[];
    setWishlistItems: (data: WishlistItemResponse[]) => void;
}

export default function Filters({ wishlistItems, setWishlistItems }: FilterProps) {
    const [search, setSearch] = useState("");
    const [platformFilters, setPlatformFilters] = useState({ win: false, mac: false, linux: false });
    const [saleFilter, seteSaleFilter] = useState(Boolean);

    const handleSearch = (text: string) => {
        setSearch(text);
    };

    useEffect(() => {
        const searchFilter = search.toLowerCase();
        const platformList = Object.keys(platformFilters).filter(key => platformFilters[key as keyof typeof platformFilters] === true);

        const items = [...wishlistItems];
        items.forEach((item) => {
            const title = item.gameName.toLowerCase();
            const platforms = item.platforms ?? [];

            item.show =
                (!searchFilter || title.includes(searchFilter)) &&
                (!saleFilter || item.maxDiscount > 0) &&
                platformList.every((element) => platforms.includes(element));
        });

        setWishlistItems(items)
        //console.log(items.filter((i) => i.show))
    }, [search, platformFilters, saleFilter]);

    return (
        <div>
            <div className={styles["filters"]}>
                <div id="platforms">
                    <label>
                        <input
                            onChange={(e) => setPlatformFilters({ ...platformFilters, win: !platformFilters.win })}
                            type="checkbox"
                            name="windows"
                            value="win"
                        />
                        Windows
                    </label>
                    <label>
                        <input onChange={(e) => setPlatformFilters({ ...platformFilters, mac: !platformFilters.mac })} type="checkbox" name="mac" value="mac" />
                        MacOS
                    </label>
                    <label>
                        <input
                            onChange={(e) => setPlatformFilters({ ...platformFilters, linux: !platformFilters.linux })}
                            type="checkbox"
                            name="linux"
                            value="linux"
                        />
                        SteamOS + Linux
                    </label>
                </div>
                <div id="sales">
                    <label>
                        <input onChange={(e) => seteSaleFilter(!saleFilter)} type="checkbox" name="on-sale" value="On Sale" />
                        On Sale
                    </label>
                </div>
            </div>
            <input onChange={(e) => handleSearch(e.target.value)} className={styles["search"]} type="text" autoComplete="off" placeholder="Filter by title" />
        </div>
    );
}
