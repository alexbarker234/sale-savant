import styles from "./wishlistItem.module.css";

type WishlistItemProp = {
    title: string;
    image: string;
    steamPrice: PriceProp;
    humblePrice: PriceProp;
};

type PriceProp = {
    finalPrice: string;
    originalPrice: string;
    discount: number;
};

const WishlistItem = ({ item }: { item: WishlistItemProp }) => {
    return (
        <div className={styles["wishlist-item"]}>
            <img src={item.image} />
            <div className={styles["content"]}>
                <div className={styles["title"]}>{item.title}</div>
                <div className={styles["prices"]}>
                    <div className={styles["price steam-price"]}>
                        {item.steamPrice.discount != 0 ? <div className={styles["discount"]}>-{item.steamPrice.discount}%</div> : ""}
                        <div className={styles["price-details"]}>
                            <svg width="50" height="50" fill="#1A1918">
                                <use href="#steam-logo" />
                            </svg>
                            <div className={styles["price-tag"]}>
                                {item.steamPrice.originalPrice ? <div className={styles["original-price"]}>{item.steamPrice.originalPrice}</div> : ""}
                                <div className={styles["final-price"]}>{item.steamPrice.finalPrice}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles["price humble-price"]}>
                        {item.humblePrice.discount != 0 ? <div className={styles["discount"]}>-{item.humblePrice.discount}%</div> : ""}
                        <div className={styles["price-details"]}>
                            <svg width="50" height="50" fill="#ffffff" viewBox="0 0 150 150">
                                <use href="#humble-logo" />
                            </svg>

                            <div className={styles["price-tag"]}>
                                {item.humblePrice.originalPrice ? <div className={styles["original-price"]}>{item.humblePrice.originalPrice}</div> : ""}
                                <div className={styles["final-price"]}>{item.humblePrice.finalPrice}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistItem;
