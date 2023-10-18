"use client";

import React, { useEffect } from "react";

import styles from "./filters.module.scss";
import wishlistItemStyles from "./wishlistItem.module.scss";

import $ from "jquery";

export default function Filters() {
    // having the onChange be covering all of these might not be the best practice?
    return (
        <div onChange={applyFilters}>
            <div className={styles["filters"]}>
                <div id="platforms">
                    <label>
                        <input type="checkbox" id="windows" name="windows" value="win" />
                        Windows
                    </label>
                    <label>
                        <input type="checkbox" id="mac" name="mac" value="mac" />
                        MacOS
                    </label>
                    <label>
                        <input type="checkbox" id="linux" name="linux" value="linux" />
                        SteamOS + Linux
                    </label>
                </div>
                <div id="sales">
                    <label>
                        <input type="checkbox" id="on-sale" name="on-sale" value="On Sale" />
                        On Sale
                    </label>
                </div>
            </div>
            <input className={styles["search"]} type="text" id="search" autoComplete="off" placeholder="Filter by title" />
        </div>
    );
}

function applyFilters() {
    const searchFilter = $("#search").val()?.toString().toLowerCase() ?? "";
    const filters = $(`.${styles["filters"]}`);
    const saleFilter = filters.find("#on-sale").is(":checked");
    const platformFilters: string[] = [];
    filters
        .find("#platforms")
        .find("input")
        .each(function () {
            if ($(this).is(":checked")) {
                platformFilters.push($(this).val()?.toString() ?? "");
            }
        });

    //const platforms = $('#linux').is(":checked").val()
    //console.log(platforms)

    $("#wishlist-items")
        .children()
        .each((index: number, element: HTMLElement) => {
            const title = $(element).find(`.${wishlistItemStyles["title"]}`).first().html().toLowerCase();

            const platforms = $(element).data("platforms").split(",");

            if (
                (!searchFilter || title.includes(searchFilter)) &&
                (!saleFilter || $(element).data("max-discount") > 0) &&
                platformFilters.every((element) => platforms.includes(element))
            )
                $(element).removeAttr("style");
            else $(element).css("display", "none");
        });
}
