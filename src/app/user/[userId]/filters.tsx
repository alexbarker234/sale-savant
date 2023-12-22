"use client";

import React, { useEffect, useState } from "react";
import styles from "./filters.module.scss";

interface FilterProps {
    wishlistItems: WishlistItem[];
    setWishlistItems: (data: WishlistItem[]) => void;
}

interface PlatformFilters {
    win: boolean;
    mac: boolean;
    linux: boolean;
}

export default function Filters({ wishlistItems, setWishlistItems }: FilterProps) {
    const [search, setSearch] = useState("");
    const [platformFilters, setPlatformFilters] = useState<PlatformFilters>({ win: false, mac: false, linux: false });
    const [saleFilter, seteSaleFilter] = useState(Boolean);

    const handleSearch = (text: string) => {
        setSearch(text);
    };

    useEffect(() => {
        const searchFilter = search.toLowerCase();
        const platformList = Object.keys(platformFilters).filter(
            (key) => platformFilters[key as keyof PlatformFilters] === true
        );

        const items = [...wishlistItems];
        items.forEach((item) => {
            const title = item.gameName.toLowerCase();
            const platforms = item.platforms ?? [];

            item.show =
                (!searchFilter || title.includes(searchFilter)) &&
                (!saleFilter || item.maxDiscount > 0) &&
                platformList.every((element) => platforms.includes(element));
        });

        setWishlistItems(items);
        //console.log(items.filter((i) => i.show))
    }, [search, platformFilters, saleFilter]);

    const platformTypes: { key: keyof typeof platformFilters; display: string }[] = [
        {
            key: "win",
            display: "Windows"
        },
        {
            key: "mac",
            display: "MacOS"
        },
        {
            key: "linux",
            display: "SteamOS + Linux"
        }
    ];

    return (
        <div>
            <div className={styles["filters"]}>
                <div id="platforms">
                    {platformTypes.map((filter) => (
                        <label key={filter.key}>
                            <input
                                onChange={(e) => {
                                    const newFilters = { ...platformFilters };
                                    newFilters[filter.key] = !newFilters[filter.key];
                                    setPlatformFilters(newFilters);
                                }}
                                type="checkbox"
                                name="windows"
                                checked={platformFilters[filter.key]}
                            />
                            {filter.display}
                        </label>
                    ))}
                </div>
                <div id="sales">
                    <label>
                        <input
                            onChange={(e) => seteSaleFilter(!saleFilter)}
                            type="checkbox"
                            name="on-sale"
                            value="On Sale"
                        />
                        On Sale
                    </label>
                </div>
            </div>
            <input
                onChange={(e) => handleSearch(e.target.value)}
                className={styles["search"]}
                type="text"
                autoComplete="off"
                placeholder="Filter by title"
            />
        </div>
    );
}
