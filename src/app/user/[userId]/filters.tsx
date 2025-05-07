"use client";

import Checkbox from "@/components/checkbox";
import { WishlistItem } from "@/types/saleSavant";
import { useEffect, useState } from "react";
import styles from "./filters.module.scss";
interface FilterProps {
  wishlistItems: WishlistItem[];
  setWishlistItems: (data: WishlistItem[]) => void;
}

export default function Filters({ wishlistItems, setWishlistItems }: FilterProps) {
  const [search, setSearch] = useState("");
  const [saleFilter, setSaleFilter] = useState(false);

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  useEffect(() => {
    const searchFilter = search.toLowerCase();

    const items = [...wishlistItems];
    items.forEach((item) => {
      const title = item.gameName.toLowerCase();

      item.show = (!searchFilter || title.includes(searchFilter)) && (!saleFilter || item.maxDiscount > 0);
    });

    setWishlistItems(items);
  }, [search, saleFilter]);

  return (
    <div>
      <div className={styles["filters"]}>
        <Checkbox id="sales" label="On Sale" checked={saleFilter} onChange={setSaleFilter} />
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
