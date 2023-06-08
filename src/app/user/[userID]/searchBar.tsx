"use client";

import React, { useEffect } from "react";

import styles from "./searchBar.module.css";
import wishlistItemStyles from "./wishlistItem.module.css";

import $ from 'jquery';

export default function UrlForm() {    
    useEffect(() => {
        const search = $('#search')

        const onKeyInput = (e: KeyboardEvent) => {
            const wishlist = $('#wishlist-items')
            console.log(search.val()?.toString() ?? "")
            wishlist.children().each((index: number, element: HTMLElement) => {               
                const title = $(element).find(`.${wishlistItemStyles['title']}`).first().html().toLowerCase()
                const searchTerm = search.val()?.toString().toLowerCase() ?? ""

                if (!search.val() || title.includes(searchTerm))
                    $(element).removeAttr('style')
                else 
                    $(element).css('display', 'none')                    
            })
        };

        window.addEventListener("keyup", onKeyInput);
        return () => window.removeEventListener("keyup", onKeyInput);
    }, []);
    return <input className={styles["search"]} type="text" id="search" autoComplete="off" placeholder="Filter by title" />;
}
