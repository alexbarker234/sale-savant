import { SaleSavantUser } from "@/types/saleSavant";
import Image from "next/image";
import Link from "next/link";
import Loading from "./loading";
import styles from "./userInfo.module.scss";

export interface GameCount {
  saleCount: number;
  gameCount: number;
}
interface UserInfoProps {
  userData: SaleSavantUser;
  gameCount: GameCount;
}

export default function UserInfo({ userData, gameCount }: UserInfoProps) {
  return userData ? (
    <div className={styles["user"]}>
      <Link href={userData?.profileURL} className={styles["image"]}>
        <Image width={184} height={184} src={userData?.avatarURL} alt="User Profile Image" />
      </Link>
      <div className={styles["details"]}>
        <Link className={styles["title"]} href={userData?.profileURL}>
          <span className={styles["username"]}>{userData?.displayName}'s</span> Wishlist
        </Link>
        <div>{gameCount.gameCount != -1 ? `${gameCount.gameCount} released games on wishlist` : ""} </div>
        <div>{gameCount.saleCount != -1 ? `${gameCount.saleCount} games on sale` : ""} </div>
      </div>
    </div>
  ) : (
    <div className={styles["user"]}>
      <Loading style={{ margin: "auto" }} />
    </div>
  );
}
