"use client";

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { IconType } from "react-icons";
import { FaListOl, FaSignOutAlt } from "react-icons/fa";
import { useSession } from "./session-provider";
import styles from "./userProfile.module.scss";

interface MenuItemProps {
  href?: string;
  onClick?: () => void;
  icon: IconType;
  label: string;
}

function ProfileMenuItem({ href, onClick, icon: Icon, label }: MenuItemProps) {
  const baseClasses = styles.menuItem;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        <Icon className={styles.menuItemIcon} />
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      <Icon className={styles.menuItemIcon} />
      {label}
    </button>
  );
}

export default function UserProfile() {
  const { user, isLoggedIn, loading, logout } = useSession();

  const menuItems: MenuItemProps[] = [
    { href: `/user/${user?.steamId}`, icon: FaListOl, label: "My Wishlist" },
    { onClick: logout, icon: FaSignOutAlt, label: "Sign Out" }
  ];

  return (
    <Menu as="div" className={styles.menuContainer}>
      <MenuButton className={styles.menuButton}>
        <Image
          src={user?.avatarUrl || ""}
          alt={user?.displayName || ""}
          width={32}
          height={32}
          className={styles.avatar}
        />
        <span className={styles.displayName}>{user?.displayName}</span>
        <svg className={styles.dropdownIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </MenuButton>

      <Transition
        as={Fragment}
        enter={styles.transitionEnter}
        enterFrom={styles.transitionEnterFrom}
        enterTo={styles.transitionEnterTo}
        leave={styles.transitionLeave}
        leaveFrom={styles.transitionLeaveFrom}
        leaveTo={styles.transitionLeaveTo}
      >
        <MenuItems className={styles.menuItems}>
          {menuItems.map(({ href, onClick, icon: Icon, label }) => (
            <MenuItem key={label}>
              <ProfileMenuItem href={href} onClick={onClick} icon={Icon} label={label} />
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
