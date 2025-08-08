"use client";

import { useSession } from "@/components/session-provider";
import UserProfile from "@/components/UserProfile";
import Link from "next/link";
import { FaSteam } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";

export default function Header() {
  const { user, isLoggedIn, loading } = useSession();

  return (
    <nav>
      <Link href="/" className="nav-logo">
        <div className="logo-s">
          <FaCrown />S
        </div>
        <p>ale Savant</p>
      </Link>

      <div className="nav-auth">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : isLoggedIn && user ? (
          <UserProfile />
        ) : (
          <Link href="/api/auth/login" className="login-btn">
            <FaSteam />
            Login with Steam
          </Link>
        )}
      </div>
    </nav>
  );
}
