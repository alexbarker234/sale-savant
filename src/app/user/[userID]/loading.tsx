import { CSSProperties } from "react";
import styles from "./loading.module.css";

interface LoadingProp {
    style?: CSSProperties;
}

export default function Loading({style} : LoadingProp) {
    return (
        <div className={`${styles["loading"]} ${(!style && styles["default"])}`} style={style}>
            <div className={styles["loading-part"]}></div>
            <div className={styles["loading-part"]}></div>
            <div className={styles["loading-part"]}></div>
        </div>
    );
}
