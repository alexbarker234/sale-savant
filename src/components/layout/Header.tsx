"use client";

import { useSession } from "@/components/session-provider";
import UserProfile from "@/components/UserProfile";
import Link from "next/link";
import { FaSteam } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";
import styles from "./header.module.scss";

export default function Header() {
  const { user, isLoggedIn, loading } = useSession();

  return (
    <nav className={styles.header}>
      <Link href="/" className={styles.navLogo}>
        <div className={styles.logoS}>
          <FaCrown />S
        </div>
        <p>ale Savant</p>
      </Link>

      <div className={styles.navAuth}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : isLoggedIn && user ? (
          <UserProfile />
        ) : (
          <Link href="/api/auth/login" className={styles.loginBtn}>
            <FaSteam />
            Login with Steam
          </Link>
        )}
      </div>
    </nav>
  );
}
