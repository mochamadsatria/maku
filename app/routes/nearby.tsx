import {
  collection,
  GeoPoint,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Navbar from "~/components/navbar";

import { useGeolocated } from "react-geolocated";
import Button from "~/components/button";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

const lat = 0.0144927536231884; // degrees latitude per mile
const lon = 0.0181818181818182; // degrees longitude per mile

export const meta: MetaFunction = () => ({
  title: "Explore nearby | Makananku Maku",
});

export default function Page() {
  const [donationsSnapshot, setDonationsSnapshot] = useState<any>();
  const [donations, setDonations] = useState<any>([]);
  const [page, setPage] = useState<number>(0);

  const [loc, setLoc] = useState<any>();

  const [isClient, setIsClient] = useState<boolean>(false);

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: true,
      },
      userDecisionTimeout: 10000,
    });

  useEffect(() => {
    const gr = async () => {
      const a = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords?.longitude},${coords?.latitude}.json?access_token=pk.eyJ1IjoiaGF6ZWxoYW5kcmF0YSIsImEiOiJjbDc5NTl5dzUwZzd0M3FzY21jNHBrcTZ4In0.lIcMlK8oXVc4ftv8pc84rg`
      );
      let data = await a.json();

      setLoc(data);
    };
    gr();
  }, [coords]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const db = getFirestore();

    const latitude = coords?.latitude || 0;
    const longitude = coords?.longitude || 0;
    const distance = 10;

    const lowerLat = latitude - lat * distance;
    const lowerLon = longitude - lon * distance;

    const upperLat = latitude + lat * distance;
    const upperLon = longitude + lon * distance;

    const coll = collection(db, "donations");
    const q = query(
      coll,
      limit(20),
      where("address", ">=", new GeoPoint(lowerLat, lowerLon)),
      where("address", "<=", new GeoPoint(upperLat, upperLon)),
      orderBy("address", "desc"),
      limit(20)
    );

    getDocs(q).then((snapshots) => {
      setDonationsSnapshot(snapshots);

      let docs: object[] = [];

      snapshots.forEach((snapshot) => {
        docs.push({
          id: snapshot.id,
          ...snapshot.data(),
        });
      });

      setDonations(docs);
    });
  }, []);

  useEffect(() => {
    if (page > 0) {
      const lastVisible =
        donationsSnapshot?.docs[donationsSnapshot.docs.length - 1];

      const db = getFirestore();

      const latitude = coords?.latitude || 0;
      const longitude = coords?.longitude || 0;
      const distance = 10;

      const lowerLat = latitude - lat * distance;
      const lowerLon = longitude - lon * distance;

      const upperLat = latitude + lat * distance;
      const upperLon = longitude + lon * distance;

      const coll = collection(db, "donations");
      const q = query(
        coll,
        limit(20),
        where("address", ">=", new GeoPoint(lowerLat, lowerLon)),
        where("address", "<=", new GeoPoint(upperLat, upperLon)),
        orderBy("address", "desc"),
        startAfter(lastVisible),
        limit(20)
      );

      getDocs(q).then((snapshots) => {
        setDonationsSnapshot(snapshots);

        let docs: object[] = [];

        snapshots.forEach((snapshot) => {
          docs.push({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });

        setDonations([...donations, ...docs]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = () => setPage(page + 1);

  return (
    <div className="overflow-hidden max-h-screen relative">
      <div className="relative z-40">
        <Navbar backTo="/" />
        {isClient && (
          <>
            {!isGeolocationAvailable ? (
              <div>Your browser does not support Geolocation</div>
            ) : !isGeolocationEnabled ? (
              <div>Geolocation is not enabled</div>
            ) : coords ? (
              <div>
                {loc && (
                  <div className="px-10">{loc.features[0].place_name}</div>
                )}
                {donations.length < 1 ? (
                  <div className="p-10">
                    <h1 className="font-bold text-4xl w-full md:w-1/2">
                      No donation on your area at this moment, please check
                      again later.
                    </h1>
                    <div className="mt-5">
                      <Link to={"/"}>
                        <Button>Go home</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="px-10 w-full md:w-3/4 lg:w-1/2">
                      <h1 className="text-4xl font-bold my-10">Donations</h1>

                      <ul className="flex flex-col gap-3">
                        {donations.map((donation: any) => (
                          <li key={donation.id}>
                            <Link
                              to={`/donations/${donation.id}`}
                              className="flex justify-between px-4 items-center hover:bg-neutral-200"
                            >
                              <div>
                                <h2>{donation.name}</h2>
                                <span>{donation.displayAddress}</span>
                              </div>
                              <img
                                alt={donation.name}
                                src={donation.display}
                                className="w-20"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-10">
                        <Button onClick={loadMore}>Load more</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10">
                <h1 className="font-bold text-4xl w-full md:w-1/2">
                  Loading...
                </h1>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
