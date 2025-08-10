import UserProfile from "@/components/UserProfile";
import { getSession } from "@/lib/session";
import Link from "next/link";
import { use } from "react";
import { FaSteam } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import styles from "./header.module.scss";

export default function Header() {
  const { user, isLoggedIn } = use(getSession());

  return (
    <nav className={styles.header}>
      <Link href="/" className={styles.navLogo}>
        <div className={styles.logoS}>
          <FaCrown />S
        </div>
        <p>ale Savant</p>
      </Link>

      <div className={styles.navAuth}>
        {isLoggedIn && user ? (
          <UserProfile />
        ) : (
          <Link href="/api/auth/login" className={styles.loginBtn}>
            <FaSteam />
            Login <span className={styles.mobileHidden}>with Steam</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
