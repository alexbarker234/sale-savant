import styles from "./userInfo.module.scss";
import Loading from "./loading";
import Image from "next/image";

export default function UserInfo({ userData }: { userData: SteamUser }) {
    return userData ? (
        <div className={styles["user"]}>
            <div className={styles["image"]}>
                <a href={userData?.profileURL}>
                    <Image width={184} height={184} src={userData?.avatarURL} alt="User Profile Image" />
                </a>
            </div>
            <div className={styles["details"]}>
                <a className={styles["title"]} href={userData?.profileURL}>
                    <div className={styles["username"]}>{userData?.displayName}</div>
                    's Wishlist
                </a>
                <div className={styles["game-count"]} id="count-games"></div>
                <div className={styles["sale-count"]} id="count-sales"></div>
            </div>
        </div>
    ) : (
        <div className={styles["user"]}>
            <Loading style={{ margin: "auto" }} />
        </div>
    );
}
