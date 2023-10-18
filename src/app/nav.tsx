import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Nav() {
    return (
        <nav>
            <Link href="/" className="nav-logo">
                <div className="logo-s">
                    <FontAwesomeIcon icon={faCrown}/> 
                    S
                </div>
                <p>ale Savant</p>
            </Link>
        </nav>
    );
}
