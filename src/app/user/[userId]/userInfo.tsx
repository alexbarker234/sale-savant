import styles from "./userInfo.module.scss";
import Loading from "./loading";
import Image from "next/image";

export interface GameCount {
  saleCount: number;
  gameCount: number;
}
interface UserInfoProps {
  userData: SteamUser;
  gameCount: GameCount;
}

export default function UserInfo({ userData, gameCount }: UserInfoProps) {
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
        <div>{gameCount.gameCount != -1 ? `${gameCount.gameCount} games on wishlist` : ""} </div>
        <div>{gameCount.saleCount != -1 ? `${gameCount.saleCount} games on sale` : ""} </div>
      </div>
    </div>
  ) : (
    <div className={styles["user"]}>
      <Loading style={{ margin: "auto" }} />
    </div>
  );
}
