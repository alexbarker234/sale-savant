"use client";

import WishlistItem from "./wishlistItem";
import { useEffect, useState } from "react";
import styles from "./wishlist.module.scss";
import Loading from "./loading";
import Filters from "./filters";
import { GameCount } from "./userInfo";

interface WishlistProp {
    userID: string;
    setGameCount: (gameCount: GameCount) => void;
}

const SortAttribute = { maxDiscount: "maxDiscount", priority: "priority", review: "review" } as const;
type SortAttribute = (typeof SortAttribute)[keyof typeof SortAttribute];
function isSortAttribute(attribute: string): attribute is SortAttribute {
    return attribute in SortAttribute;
}

const sortOptions = [
    {
        attribute: "maxDiscount",
        name: "Discount",
        dir: 1
    },
    {
        attribute: "priority",
        name: "Priority",
        dir: -1
    },
    {
        attribute: "review",
        name: "Review",
        dir: 1
    }
];

export default function Wishlist({ userID, setGameCount }: WishlistProp) {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>();
    const [message, setMessage] = useState("");
    const [currentSort, setCurrentSort] = useState<SortAttribute>(SortAttribute.maxDiscount);

    useEffect(() => {
        //console.log(`trying to request for ${userID}`);

        const fetchData = async () => {
            const res = await fetch(`/api/get-wishlist?id=${userID}`);
            const data: WishlistResponse | ErrorResponse = await res.json();
            if (data.error === "private profile") {
                setMessage(
                    "This users profile is private, if this is your profile please make your Game Details public"
                );
                return;
            } else if ("error" in data) {
                setMessage("An error occured");
                return;
            }

            const sortDir = sortOptions.find((s) => s.attribute === currentSort)?.dir ?? 1;
            let wishlistItems = Object.values(data)
                .sort((a, b) => (b[currentSort] - a[currentSort]) * sortDir)
                .filter((item) => item.isReleased)
                .filter((item) => item.steamDeal);

            setGameCount({
                saleCount: wishlistItems.filter(
                    (item) => item.steamDeal?.discountPercent || item.humbleDeal?.discountPercent
                ).length,
                gameCount: wishlistItems.length
            });
            setWishlistItems(wishlistItems);
            setMessage("success");
        };

        fetchData();
    }, [userID]);

    const orderBy = (attribute: SortAttribute, sortDir: number = 1) => {
        setCurrentSort(attribute);
        if (!wishlistItems) return;
        let list = [...wishlistItems];

        list.sort((a, b) => (b[attribute] - a[attribute]) * sortDir);

        setWishlistItems(list);
    };
    console.log(message);

    if (message != "success") {
        return <div style={{ margin: "auto", marginTop: "1rem", width: "fit-content" }}>{message}</div>;
    }

    // TODO: add ⚠ symbol on unhandled error
    return (
        <div className={styles["wishlist"]}>
            {wishlistItems ? (
                <>
                    <Filters wishlistItems={wishlistItems} setWishlistItems={setWishlistItems} />
                    <div className={styles["order-buttons"]}>
                        {sortOptions.map((sortType) => (
                            <button
                                key={sortType.attribute}
                                className={currentSort === sortType.attribute ? styles["current"] : ""}
                                onClick={() =>
                                    isSortAttribute(sortType.attribute) && orderBy(sortType.attribute, sortType.dir)
                                }
                            >
                                {sortType.name}
                            </button>
                        ))}
                    </div>
                    <div id="wishlist-items" key={Math.random()}>
                        {wishlistItems.map((wishlistItem, index) => (
                            <WishlistItem key={index} index={index} item={wishlistItem} />
                        ))}
                    </div>
                </>
            ) : (
                <Loading style={{ margin: "auto", marginTop: "2rem" }} />
            )}
        </div>
    );
}
