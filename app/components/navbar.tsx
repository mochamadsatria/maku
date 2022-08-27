import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faCartShopping,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "@remix-run/react";
import { Menu } from "@headlessui/react";
import { getAuth, signOut } from "firebase/auth";
import Button from "./button";
import { useEffect, useLayoutEffect, useState } from "react";

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export default function Navbar({ backTo }: { backTo?: string }) {
  const navigate = useNavigate();

  const auth = getAuth();

  const [width, height] = useWindowSize();

  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

        <Link
          to={"/"}
          className="bg-[url('/android-chrome-192x192.png')] bg-center h-20 w-32 bg-no-repeat"
        >
          <div></div>
        </Link>
      </div>
      <div className="flex items-center">
        {isClient && !auth.currentUser && width > 768 && (
          <div className="flex gap-5 mx-5 items-center">
            <Link to={"/register"}>
              <button className="py-2 bg-brand-green text-brand-yellow rounded-lg px-4 font-bold">
                Signup
              </button>
            </Link>
            <Link to={"/login"}>
              <button className="font-medium">Login</button>
            </Link>
          </div>
        )}

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
            <Menu.Items className="absolute bg-white right-0 origin-top-right mt-4 first:pt-2 last:pb-2 shadow-lg rounded-lg overflow-hidden font-semibold">
              <div className="flex flex-col gap-3">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      className={`${
                        active && "bg-brand-green text-brand-yellow"
                      } px-4 py-2`}
                      to="/account-settings"
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                {isClient && !auth.currentUser && (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          className={`${
                            active && "bg-brand-green text-brand-yellow"
                          } px-4 py-2`}
                          to={"/login"}
                        >
                          Login
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          className={`${
                            active && "bg-brand-green text-brand-yellow"
                          } px-4 py-2`}
                          to={"/register"}
                        >
                          Signup
                        </Link>
                      )}
                    </Menu.Item>
                  </>
                )}
                {isClient && auth.currentUser && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active && "bg-brand-green text-brand-yellow"
                        } flex items-center gap-3  px-4 py-2`}
                        onClick={() => {
                          const auth = getAuth();
                          signOut(auth).then(() => {
                            navigate("/");
                          });
                        }}
                      >
                        Logout&nbsp;
                        <FontAwesomeIcon icon={faSignOut} />
                      </button>
                    )}
                  </Menu.Item>
                )}
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
  );
}
