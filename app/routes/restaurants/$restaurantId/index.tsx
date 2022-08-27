import { Link, useParams } from "@remix-run/react";

import Map, { Marker } from "react-map-gl";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import { motion } from "framer-motion";
import Button from "~/components/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Navbar from "~/components/navbar";
import { MetaFunction } from "@remix-run/node";

dayjs.extend(relativeTime);

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGF6ZWxoYW5kcmF0YSIsImEiOiJjbDc5NTl5dzUwZzd0M3FzY21jNHBrcTZ4In0.lIcMlK8oXVc4ftv8pc84rg";

export const meta: MetaFunction = () => ({
  title: "Explore restaurant product | Makananku Maku",
});

export default function Page() {
  //const [client, setClient] = useState<boolean>(false);
  const [about, setAbout] = useState<any>();
  const [productsSnapshot, setProductsSnapshot] = useState<any>();
  const [products, setProducts] = useState<any>([]);

  const [tab, setTab] = useState<number>(0);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const [page, setPage] = useState<number>(0);

  const params = useParams();

  const getRestaurantAbout = () => {
    const db = getFirestore();

    const coll = collection(db, "restaurants");
    const docRef = doc(coll, params.restaurantId);

    getDoc(docRef).then((item) => {
      setAbout({
        id: item.id,
        ...item.data(),
      });
    });
  };

  const getRestaurantProducts = () => {
    const db = getFirestore();

    const coll = collection(db, `restaurants/${params.restaurantId}/products`);

    const q = query(coll, limit(10));

    getDocs(q).then((snapshots) => {
      setProductsSnapshot(snapshots);

      let docs: object[] = [];

      snapshots.forEach((snapshot) => {
        docs.push({
          id: snapshot.id,
          ...snapshot.data(),
        });
      });

      setProducts(docs);
    });
  };

  useEffect(() => {
    getRestaurantAbout();
    getRestaurantProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page > 0) {
      const lastVisible =
        productsSnapshot?.docs[productsSnapshot.docs.length - 1];

      const db = getFirestore();

      const coll = collection(
        db,
        `restaurants/${params.restaurantId}/products`
      );
      const q = query(coll, startAfter(lastVisible), limit(20));

      getDocs(q).then((snapshots) => {
        setProductsSnapshot(snapshots);

        let docs: object[] = [];

        snapshots.forEach((snapshot) => {
          docs.push({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });

        setProducts([...products, ...docs]);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = () => setPage(page + 1);

  return (
    <div className="overflow-hidden max-h-screen relative">
      <div className="relative z-40">
        <Navbar backTo="/restaurants" />
      </div>
      {about && (
        <>
          {about.address && (
            <div className="relative z-0">
              <Map
                initialViewState={{
                  latitude: about.address._lat,
                  longitude: about.address._long,
                  zoom: 14,
                }}
                style={{
                  width: "100vw",
                  height: "100vh",
                }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={MAPBOX_TOKEN}
              >
                <Marker
                  longitude={about.address._long}
                  latitude={about.address._lat}
                  color="red"
                />
              </Map>
            </div>
          )}

          <div
            className={`absolute z-40 bottom-0 ${
              menuOpen ? "h-1/2" : "h-1/4"
            } hover:h-1/2 transform duration-150 bg-white overflow-y-scroll`}
          >
            <div className="p-10 w-screen">
              <button
                className="w-full mb-3"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FontAwesomeIcon icon={faChevronUp} />
              </button>
              <div className="text-4xl font-bold">{about.name}</div>
              <div>
                <span>
                  Joined {dayjs(about.registerAt.seconds * 1000).fromNow()}
                </span>
              </div>
              <div className="mt-5">
                <h2 className="font-bold text-lg tracking-wide mb-2">
                  Products
                </h2>
                <ul>
                  {products.map((product: any) => (
                    <li key={product.id}>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-full"
                      >
                        <Link
                          to={`product/${product.id}`}
                          className="py-1 flex justify-between items-center hover:bg-neutral-200 px-4"
                        >
                          <h3 className="font-medium">{product.name}</h3>
                          <img
                            alt={product.name}
                            src={product.display[0]}
                            className="w-20 h-20"
                          />
                        </Link>
                      </motion.button>
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Button onClick={loadMore}>Load more</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
