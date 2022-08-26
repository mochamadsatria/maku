import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowLeftLong,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@remix-run/react";

export default function Navbar({ backTo }: { backTo: string }) {
  return (
    <div className="flex bg-white w-full px-10 py-5 justify-between">
      <Link to={backTo}>
        <button>
          <FontAwesomeIcon icon={faArrowLeftLong} />
        </button>
      </Link>
      <Link to="/cart">
        <button>
          <FontAwesomeIcon icon={faCartShopping} />
        </button>
      </Link>
    </div>
  );
}
