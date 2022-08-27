import { lazy, Suspense, useEffect, useState } from "react";

import type { DocumentData, QuerySnapshot } from "firebase/firestore";

import {
  collection,
  getDocs,
  getFirestore,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import Button from "~/components/button";
import { Link } from "@remix-run/react";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

export default function Page() {
  //const [isClient, setIsClient] = useState<boolean>(false);

  const [restaurantsSnapshot, setRestaurantsSnapshot] =
    useState<QuerySnapshot<DocumentData>>();
  const [restaurants, setRestaurants] = useState<object[]>([]);
  const [page, setPage] = useState<number>(0);

  /*useEffect(() => {
    setIsClient(true);
  }, []);*/

  useEffect(() => {
    const db = getFirestore();

    const coll = collection(db, "restaurants");
    const q = query(coll, limit(20));

    getDocs(q).then((snapshots) => {
      setRestaurantsSnapshot(snapshots);

      let docs: object[] = [];

      snapshots.forEach((snapshot) => {
        docs.push({
          id: snapshot.id,
          ...snapshot.data(),
        });
      });

      setRestaurants(docs);
    });
  }, []);

  useEffect(() => {
    if (page > 0) {
      const lastVisible =
        restaurantsSnapshot?.docs[restaurantsSnapshot.docs.length - 1];

      const db = getFirestore();

      const coll = collection(db, "restaurants");
      const q = query(coll, startAfter(lastVisible), limit(20));

      getDocs(q).then((snapshots) => {
        setRestaurantsSnapshot(snapshots);

        let docs: object[] = [];

        snapshots.forEach((snapshot) => {
          docs.push({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });

        setRestaurants([...restaurants, ...docs]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = () => setPage(page + 1);

  return (
    <div>
      <Navbar backTo="/" />
      <div className="p-10 flex flex-col gap-3">
        <h1 className="text-4xl font-bold">Restaurants</h1>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {restaurants.map((restaurant: any) => (
            <li key={restaurant.id}>
              <Link to={`/restaurants/${restaurant.id}`} className="group">
                <img
                  alt={restaurant.name}
                  src={restaurant.logo}
                  className="group-hover:bg-neutral-200 p-10"
                />
              </Link>
            </li>
          ))}
        </ul>

        <Button onClick={loadMore}>Load more</Button>
      </div>
      <Footer />
    </div>
  );
}
