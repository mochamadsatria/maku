import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import { getAnalytics } from "firebase/analytics";

import styles from "./styles/app.css";
import app from "./firebase";
import { QueryClient, QueryClientProvider } from "react-query";
import { dom } from "@fortawesome/fontawesome-svg-core";

export function links() {
  return [
    { rel: "manifest", href: "/site.webmanifest" },

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

function App() {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    getAnalytics(app);
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        {isClient && <style>{dom.css()}</style>}
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

const queryClient = new QueryClient();

export default function AppWithProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
