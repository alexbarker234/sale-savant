import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div>
        By <a href="https://github.com/alexbarker234">Alex Barker</a>
      </div>
      <div className={styles.links}>
        <a href="https://github.com/alexbarker234/sale-savant">GitHub</a>
      </div>
    </div>
  );
}
