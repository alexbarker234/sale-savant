import styles from "./wishlistItem.module.css";

type WishlistItemProp = {
    index: number;
    title: string;
    image: string;
    steamPrice: PriceProp;
    humblePrice: PriceProp | undefined;
};

type PriceProp = {
    finalPrice: number;
    originalPrice: number;
    discount: number;
};

const WishlistItem = ({ item }: { item: WishlistItemProp }) => {
    return (
        <div className={styles["wishlist-item"]} style={{
            animationDelay: `${0.2 + item.index * 0.05}s`
        }}>
            <img src={item.image} />
            <div className={styles["content"]}>
                <div className={styles["title"]}>{item.title}</div>
                <div className={styles["prices"]}>
                    <Price price={item.steamPrice} type="steam" />
                    {item.humblePrice ? <Price price={item.humblePrice} type="humble" /> : null}
                </div>
            </div>
        </div>
    );
};

function Price({ price, type }: { price: PriceProp; type: string }) {
    return (
        <div className={`${styles["price"]} ${styles[type + "-price"]}`}>
            {price.discount != 0 ? <div className={styles["discount"]}>-{price.discount}%</div> : ""}
            <div className={styles["price-details"]}>
                <svg width="50" height="50" fill="#ffffff" viewBox="0 0 150 150">
                    <use href={`#${type}-logo`} />
                </svg>

                <div className={styles["price-tag"]}>
                    {price.originalPrice && price.originalPrice != price.finalPrice ? <div className={styles["original-price"]}>USD${price.originalPrice.toFixed(2)}</div> : ""}
                    <div className={styles["final-price"]}>USD${price.finalPrice.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );
}

export default WishlistItem;
