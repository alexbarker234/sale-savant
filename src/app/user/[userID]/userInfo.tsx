import { SteamUser } from "@/types";
import styles from "./userInfo.module.css";
import Loading from "./loading";

interface UserInfoProp {
    userData: SteamUser;
}

export default function UserInfo({ userData }: UserInfoProp) {

    const lastSeen = new Date((userData?.lastSeenTimestamp || 0) * 1000);

    return userData ? (
        <div className={styles["user"]}>
            <div className={styles["image"]}>
                <a href={userData?.profileURL}>
                    <img src={userData?.avatarURL} />
                </a>
            </div>
            <div className={styles["details"]}>
                <a className={styles["title"]} href={userData?.profileURL}>
                    {userData?.displayName}'s Wishlist
                </a>
                <div className={styles["last-seen"]}>
                    Last Online {getTimeAgo(userData?.lastSeenTimestamp || 0)}
                    <div className={styles["on-hover"]}>
                        <div className={styles["on-hover-content"]}>
                            {`${lastSeen.getUTCDate()} ${monthNames[lastSeen.getUTCMonth()]} ${lastSeen.getUTCFullYear()}`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ): 
    ( <div className={styles["user"]}><Loading style={{margin:"auto"}}/></div>);
}

/*


        <div className="user">
            <img src={userData?.avatarURL}></img>
            <a href={userData?.profileURL}>{userData?.displayName}'s Wishlist</a>
            <div className="last-seen">
                Last Online {getTimeAgo(userData?.lastSeenTimestamp || 0)}
                <div className="on-hover">{`${lastSeen.getUTCDate()} ${monthNames[lastSeen.getUTCMonth()]} ${lastSeen.getUTCFullYear()}`}</div>
            </div>
        </div>

*/

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function getTimeAgo(unixTimestamp: number): string {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDifference = currentTimestamp - unixTimestamp;

    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    if (timeDifference < minute) {
        return `${timeDifference} seconds ago`;
    } else if (timeDifference < hour) {
        const minutes = Math.floor(timeDifference / minute);
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (timeDifference < day) {
        const hours = Math.floor(timeDifference / hour);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (timeDifference < week) {
        const days = Math.floor(timeDifference / day);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (timeDifference < month) {
        const weeks = Math.floor(timeDifference / week);
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (timeDifference < year) {
        const months = Math.floor(timeDifference / month);
        return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
        const years = Math.floor(timeDifference / year);
        return `${years} year${years > 1 ? "s" : ""} ago`;
    }
}
