import Link from "next/link";
import { FaCrown } from "react-icons/fa6";

export default function Nav() {
  return (
    <nav>
      <Link href="/" className="nav-logo">
        <div className="logo-s">
          <FaCrown />S
        </div>
        <p>ale Savant</p>
      </Link>
    </nav>
  );
}
