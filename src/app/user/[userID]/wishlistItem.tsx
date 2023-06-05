import styles from "./wishlistItem.module.css";
import { Deal, WishlistItemResponse } from "@/types";

const WishlistItem = ({ index, item }: { index: number; item: WishlistItemResponse }) => {
    return (
        <div
            className={styles["wishlist-item"]}
            style={{
                animationDelay: `${0.2 + index * 0.05}s`,
            }}
        >
            <img src={item.image_url} />
            <div className={styles["content"]}>
                <div className={styles["title"]}>{item.game_name}</div>
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

export default WishlistItem;
