"use client";

import { ErrorResponse, WishlistItemResponse, WishlistResponse } from "@/types";
import WishlistItem from "./wishlistItem";
import { useEffect, useState } from "react";
import styles from "./wishlist.module.scss";
import itemStyles from "./wishlistItem.module.scss";
import Loading from "./loading";
import Filters from "./filters"

interface WishlistProp {
    userID: string;
}

export default function Wishlist({ userID }: WishlistProp) {
    // keep up to date with https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#use-in-client-components
    // fetch cant be done in use safely yet but it will be useful :)

    const [wishlistData, setData] = useState<{ message: string; data: { id: string; wishlistItem: WishlistItemResponse }[] }>();

    useEffect(() => {
        //console.log(`trying to request for ${userID}`);

        const fetchData = async () => {
            const res = await fetch(`/api/get-wishlist?id=${userID}`);
            const data: WishlistResponse | ErrorResponse = await res.json();

            if (data.error === "private profile") {
                setData({ message: "This users profile is private, if this is your profile please make your Game Details public", data: [] });
                return;
            }

            // Turns the wishlist response into an array of objects {'id', 'wishlistItem'} in order to sort by priority
            let arr = Object.entries(data).map(([key, value]) => ({ id: key, wishlistItem: value as WishlistItemResponse }));
            arr.sort((a, b) => a.wishlistItem.priority - b.wishlistItem.priority);

            const gamesCount = arr.length;

            // remove unreleased games from the list
            arr = arr.filter((item) => item.wishlistItem.is_released);

            // remove items not found on cheapshark (DLC, non-games)
            arr = arr.filter((item) => item.wishlistItem.steamDeal);

            // modify user profile
            const saleCountDiv = document.getElementById("count-sales");
            const gameCountDiv = document.getElementById("count-games");
            const salesCount = arr.filter(
                (item) => item.wishlistItem.steamDeal?.discountPercent || item.wishlistItem.humbleDeal?.discountPercent 
            ).length;

            if (saleCountDiv) saleCountDiv.innerHTML = `${salesCount} games on sale`;
            if (gameCountDiv) gameCountDiv.innerHTML = `${gamesCount} games on wishlist`;

            setData({ message: "success", data: arr });
        };

        fetchData();
    }, [userID]);

    const orderByDiscount = () => orderBy("max-discount");
    const orderByPriority = () => orderBy("priority");
    const orderByReview = () => orderBy("review");

    // TODO: find a better way of loading SVGs
    return (
        <div className={styles["wishlist"]}>
            <svg width="150" xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                <symbol id="steam-logo" viewBox="0 0 256 259">
                    <path d="M127.778579,0 C60.4203546,0 5.24030561,52.412282 0,119.013983 L68.7236558,147.68805 C74.5451924,143.665561 81.5845466,141.322185 89.1497766,141.322185 C89.8324924,141.322185 90.5059824,141.340637 91.1702465,141.377541 L121.735621,96.668877 L121.735621,96.0415165 C121.735621,69.1388208 143.425688,47.2457835 170.088511,47.2457835 C196.751333,47.2457835 218.441401,69.1388208 218.441401,96.0415165 C218.441401,122.944212 196.751333,144.846475 170.088511,144.846475 C169.719475,144.846475 169.359666,144.83725 168.99063,144.828024 L125.398299,176.205276 C125.425977,176.786507 125.444428,177.367738 125.444428,177.939743 C125.444428,198.144443 109.160732,214.575753 89.1497766,214.575753 C71.5836817,214.575753 56.8868387,201.917832 53.5655182,185.163615 L4.40997549,164.654462 C19.6326942,218.967277 69.0834655,258.786219 127.778579,258.786219 C198.596511,258.786219 256,200.847629 256,129.393109 C256,57.9293643 198.596511,0 127.778579,0 Z M80.3519677,196.332478 L64.6033732,189.763644 C67.389592,195.63131 72.2239585,200.539484 78.6359521,203.233444 C92.4932392,209.064206 108.472481,202.430791 114.247888,188.435116 C117.043333,181.663313 117.061785,174.190342 114.294018,167.400086 C111.526251,160.609831 106.295171,155.31417 99.5879487,152.491048 C92.9176301,149.695603 85.7767911,149.797088 79.5031858,152.186594 L95.777656,158.976849 C105.999942,163.276114 110.834309,175.122157 106.571948,185.436702 C102.318812,195.751247 90.574254,200.631743 80.3519677,196.332478 Z M202.30901,96.0424391 C202.30901,78.1165345 187.85204,63.5211763 170.092201,63.5211763 C152.323137,63.5211763 137.866167,78.1165345 137.866167,96.0424391 C137.866167,113.968344 152.323137,128.554476 170.092201,128.554476 C187.85204,128.554476 202.30901,113.968344 202.30901,96.0424391 Z M145.938821,95.9870838 C145.938821,82.4988323 156.779242,71.5661525 170.138331,71.5661525 C183.506646,71.5661525 194.347066,82.4988323 194.347066,95.9870838 C194.347066,109.475335 183.506646,120.408015 170.138331,120.408015 C156.779242,120.408015 145.938821,109.475335 145.938821,95.9870838 Z"></path>
                </symbol>
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
                <symbol id="humble-logo" viewBox="0 0 1027 1014">
                    <path d="M765.201172,820.589844 C620.475426,820.589844 843.283203,0.189453125 843.283203,0.189453125 L694.142578,5.68434189e-14 C694.142578,5.68434189e-14 633.090481,193.090536 592.811289,407.652717 L464.271164,407.652717 C467.639745,363.532521 469.262415,318.878282 468.522971,274.491064 C462.730655,-78.7375255 255.842002,-13.3140749 163.226562,67.7578125 C75.1710315,144.824375 1.42382812,291.240234 0,403.996094 C14.0273437,403.3125 69.4453125,403.074219 69.4453125,403.074219 C69.4453125,403.074219 115.528161,192.837891 260.253906,192.837891 C404.959112,192.837891 181.810547,1013.25 181.810547,1013.25 L331.015625,1013.36133 C331.015625,1013.36133 408.132049,793.724753 446.480469,548.455078 L569.224609,547.75 C562.076645,611.218997 559.803302,681.30885 560.850849,746.400517 C566.663705,1099.62911 772.743935,1023.82674 865.359375,942.775391 C957.974815,861.703503 1027.08594,690.517578 1026.23242,608.322266 C1026.3457,608.228516 955.882812,608.892578 955.037109,608.875 C955.279297,615.365234 909.906377,820.589844 765.201172,820.589844 Z" />
                </symbol>
            </svg>

            {wishlistData ? (
                wishlistData.message === "success" ? (
                    <>
                        <Filters/>
                        <div className={styles["order-buttons"]}>
                            <button onClick={orderByDiscount}>Discount</button>
                            <button onClick={orderByPriority}>Priority</button>
                            <button onClick={orderByReview}>Review</button>
                        </div>
                        <div id="wishlist-items">
                            {wishlistData.data?.map((obj, index) => (
                                <WishlistItem key={obj.wishlistItem.game_name} index={index} item={obj.wishlistItem} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ margin: "auto", marginTop: "1rem", width: "fit-content" }}>{wishlistData.message}</div>
                )
            ) : (
                <Loading style={{ margin: "auto", marginTop: "2rem" }} />
            )}
        </div>
    );
}

function orderBy(dataAttribute: string) {
    let list = Array.from(document.getElementsByClassName(`${itemStyles["wishlist-item"]}`));

    const sortDir = dataAttribute == "priority" ? -1 : 1;
    list.sort((a, b) => {
        const discA = parseInt(a.getAttribute(`data-${dataAttribute}`) || "0");
        const discB = parseInt(b.getAttribute(`data-${dataAttribute}`) || "0");
        return (discB - discA) * sortDir;
    });
    const wishlist = document.getElementById("wishlist-items");
    if (wishlist) {
        wishlist.innerHTML = "";
        list.forEach((list) => {
            wishlist.appendChild(list);
        });
    }
}
