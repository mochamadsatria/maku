import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Makananku Maku",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyD0C5va07srXUGB_mpfBlB5eXWU-0ziCuk",
      authDomain: "maku-a77ea.firebaseapp.com",
      databaseURL:
        "https://maku-a77ea-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "maku-a77ea",
      storageBucket: "maku-a77ea.appspot.com",
      messagingSenderId: "1043419372238",
      appId: "1:1043419372238:web:80e0a71d0fffa3adf68e9f",
      measurementId: "G-TB0LC5WHWQ",
    };

    const app = initializeApp(firebaseConfig);

    getAnalytics(app);
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
