import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

export default function Nav() {
    return (
        <nav>
            <a href="/" className="nav-logo">
                <div className="logo-s">
                    <FontAwesomeIcon icon={faCrown}/> 
                    S
                </div>
                <p>ale Savant</p>
            </a>
        </nav>
    );
}
