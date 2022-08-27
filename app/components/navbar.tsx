import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faCartShopping,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@remix-run/react";
import { Menu } from "@headlessui/react";
import { getAuth, signOut } from "firebase/auth";

export default function Navbar({ backTo }: { backTo?: string }) {
  return (
    <div className="flex bg-white w-full px-10 py-5 justify-between">
      <div className="flex items-center gap-5">
        {backTo && (
          <Link to={backTo as string}>
            <button>
              <FontAwesomeIcon icon={faArrowLeftLong} />
            </button>
          </Link>
        )}

        <div className="bg-[url('/android-chrome-192x192.png')] bg-center h-20 w-32 bg-no-repeat"></div>
      </div>
      <div className="flex items-center">
        <Link to="/cart">
          <button className="px-4">
            <FontAwesomeIcon icon={faCartShopping} />
          </button>
        </Link>

        <div className="text-right">
          <Menu as="div" className="relative">
            <Menu.Button>
              <span className="px-4">
                <FontAwesomeIcon icon={faUser} />
              </span>
            </Menu.Button>
            <Menu.Items className="absolute bg-white right-0 origin-top-right mt-4">
              <div className="flex flex-col gap-3">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${active && "bg-blue-500"} px-4 py-2`}
                      to="/account-settings"
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active && "bg-blue-500"
                      } flex items-center gap-3  px-4 py-2`}
                      onClick={() => {
                        const auth = getAuth();
                        signOut(auth);
                      }}
                    >
                      Logout&nbsp;
                      <FontAwesomeIcon icon={faSignOut} />
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
  );
}
