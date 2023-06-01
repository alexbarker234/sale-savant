import styles from "./wishlistItem.module.css";


const WishlistItem = () => {
    return (
        <div className={styles["wishlist-item"]}>
            <img src="https://cdn.akamai.steamstatic.com/steam/apps/347800/header_292x136.jpg?t=1667490869" />
            <div className={styles["content"]}>
                <div className={styles["title"]}>Ghost Song</div>
                <div className={styles["prices"]}>
                    <div className={styles["price steam-price"]}>
                        <div className={styles["price-details"]}>
                            <svg width="50" height="50" fill="#1A1918">
                                <use href="#steam-logo" />
                            </svg>
                            <div className={styles["price-tag"]}>
                                <div className={styles["final-price"]}>A$10.30</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles["price humble-price"]}>
                        <div className={styles["discount"]}>-20%</div>
                        <div className={styles["price-details"]}>
                            <svg width="50" height="50" fill="#ffffff" viewBox="0 0 150 150">
                                <use href="#humble-logo" />
                            </svg>

                            <div className={styles["price-tag"]}>
                                <div className={styles["original-price"]}>A$10.30</div>
                                <div className={styles["final-price"]}>A$8.24</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistItem;
