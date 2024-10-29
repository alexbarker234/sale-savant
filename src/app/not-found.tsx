import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <div className={styles["error"]}>
      <div className={styles["details"]}>
        <div className={styles["code"]}>404</div>
        <div>This page could not be found</div>
      </div>
      <Link className={styles["back"]} href="/">
        Return Home
      </Link>
    </div>
  );
}
