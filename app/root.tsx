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

import { getAnalytics } from "firebase/analytics";

import styles from "./styles/app.css";
import app from "./firebase";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: "https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css",
    },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Makananku Maku",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  useEffect(() => {
    getAnalytics(app);
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
