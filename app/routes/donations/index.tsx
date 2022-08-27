import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import type { DocumentData, QuerySnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "~/components/button";
import { Link } from "@remix-run/react";
import Navbar from "~/components/navbar";

export default function Page() {
  const [donationsSnapshot, setDonationsSnapshot] =
    useState<QuerySnapshot<DocumentData>>();
  const [donations, setDonations] = useState<object[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const db = getFirestore();

    const coll = collection(db, "donations");
    const q = query(coll, limit(20));

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

      const coll = collection(db, "donations");
      const q = query(coll, startAfter(lastVisible), limit(20));

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
    <div>
      <Navbar backTo="/" />
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
                  <h2>{donation.name}</h2>
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
    </div>
  );
}
