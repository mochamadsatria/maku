import { Link } from "@remix-run/react";
import {
  getFirestore,
  collection,
  query,
  limit,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "~/components/button";
import Footer from "~/components/footer";
import Navbar from "~/components/navbar";

export default function Index() {
  const [restaurants, setRestaurants] = useState<object[]>([]);

  const [donations, setDonations] = useState<object[]>([]);

  useEffect(() => {
    const db = getFirestore();

    const coll = collection(db, "restaurants");
    const q = query(coll, limit(20));

    getDocs(q).then((snapshots) => {
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
    const db = getFirestore();

    const coll = collection(db, "donations");
    const q = query(coll, limit(20));

    getDocs(q).then((snapshots) => {
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

  return (
    <div className="">
      <Navbar />

      <ul className="flex justify-between px-10 flex-wrap gap-5 odd:bg-orange-300 even:bg-neutral-200">
        <li className="py-2">
          <Link to={"/restaurants"}>Restaurants</Link>
        </li>
        <li className="py-2">
          <Link to={"/donations"}>Donations</Link>
        </li>
        <li className="py-2">
          <Link to={"/nearby"}>Nearby</Link>
        </li>
        <li className="py-2">
          <Link to={"/donations/create"}>Create donation</Link>
        </li>
        <li className="py-2">
          <Link to={"/history"}>History</Link>
        </li>
      </ul>
      <div className="p-10 flex flex-col gap-3">
        <h1 className="text-4xl font-bold">Restaurants</h1>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {restaurants.map((restaurant: any) => (
            <li key={restaurant.id}>
              <Link to={`/restaurants/${restaurant.id}`} className="group ">
                <div className="p-5 group-hover:bg-neutral-200">
                  <img alt={restaurant.name} src={restaurant.logo} />
                  <div className="">
                    <h2 className="text-lg font-medium">{restaurant.name}</h2>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link to={"/restaurants"}>
          <Button>Load more</Button>
        </Link>
      </div>
      <div className="p-10 flex flex-col gap-3">
        <h1 className="text-4xl font-bold">Donations</h1>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {donations.map((donation: any) => (
            <li key={donation.id}>
              <Link to={`/donations/${donation.id}`} className="group ">
                <div className="p-5 group-hover:bg-neutral-200">
                  <img alt={donation.name} src={donation.display} />
                  <div className="">
                    <h2 className="text-lg font-medium">{donation.name}</h2>{" "}
                    <span>{donation.displayAddress}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Link to={"/donations"}>
          <Button>Load more</Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
