import styles from "./wishlistItem.module.scss";
import { Deal, WishlistItemResponse } from "@/types";

// doing dangerouslySetInnerHTML to deal with games that have HTMl entities in their name

const WishlistItem = ({ index, item }: { index: number; item: WishlistItemResponse }) => {
    return (
        <div
            className={styles["wishlist-item"]}
            data-max-discount={Math.max(item.steamDeal?.discountPercent ?? 0, item.humbleDeal?.discountPercent ?? 0)}
            data-priority={item.priority}
            data-review={item.review}
            data-platforms={item.platforms}
        >
            <img src={item.image_url} />
            <div className={styles["content"]}>
                <div className={styles["details"]}>
                    <div className={styles["title"]}dangerouslySetInnerHTML={{ __html: item.game_name }}></div>
                    <div className={styles["details-section"]}>
                        <div>Overall reviews:</div>
                        <div className={styles[getReviewCSS(item.review)]}>{item.review}%</div>
                    </div>
                    <div className={styles["platform-icons"]}>{
                        item.platforms?.map(obj => (
                            <div className={`${styles["platform-icon"]} ${styles[obj]}`}/>
                        ))
                    }</div>
                </div>
                <div className={styles["prices"]}>
                    {item.steamDeal && <Price price={item.steamDeal} type="steam" />}
                    {item.humbleDeal && <Price price={item.humbleDeal} type="humble" />}
                </div>
            </div>
        </div>
    );
};

function Price({ price, type }: { price: Deal; type: string }) {
    return (
        <a href={`https://www.cheapshark.com/redirect?dealID=${price.dealID}`}>
            <div className={`${styles["price"]} ${styles[type + "-price"]} ${price.discountPercent != 0 && styles["discounted"]}`}>
                {price.discountPercent != 0 ? <div className={styles["discount"]}>-{price.discountPercent}%</div> : ""}
                <div className={styles["price-details"]}>
                    <svg width="50" height="50" fill="#ffffff" viewBox="0 0 150 150">
                        <use href={`#${type}-logo`} />
                    </svg>

                    <div className={styles["price-tag"]}>
                        {price.originalPrice && price.originalPrice != price.currentPrice ? (
                            <div className={styles["original-price"]}>USD${price.originalPrice.toFixed(2)}</div>
                        ) : (
                            ""
                        )}
                        <div className={styles["final-price"]}>USD${price.currentPrice.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </a>
    );
}

function getReviewCSS(percent: number) {
    if (percent < 50) return "negative";
    else if (percent < 70) return "mixed";
    else if (percent < 85) return "positive";
    return "amazing";
}

export default WishlistItem;
