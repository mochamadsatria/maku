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
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";

export default function Page() {
  const [historiesSnapshot, setHistoriesSnapshot] =
    useState<QuerySnapshot<DocumentData>>();
  const [histories, setHistories] = useState<object[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const db = getFirestore();

    const auth = getAuth();

    // ${auth.currentUser.uid}

    const coll = collection(
      db,
      `users/d9gVpTlLfhl98UGEPA3B/historyTransaction`
    );
    const q = query(coll, limit(20));

    getDocs(q).then((snapshots) => {
      setHistoriesSnapshot(snapshots);

      let docs: object[] = [];

      snapshots.forEach((snapshot) => {
        docs.push({
          id: snapshot.id,
          ...snapshot.data(),
        });
      });

      setHistories(docs);
    });
  }, []);

  useEffect(() => {
    if (page > 0) {
      const lastVisible =
        historiesSnapshot?.docs[historiesSnapshot.docs.length - 1];

      const db = getFirestore();

      const auth = getAuth();

      // ${auth.currentUser.uid}

      const coll = collection(
        db,
        `users/d9gVpTlLfhl98UGEPA3B/historyTransaction`
      );
      const q = query(coll, startAfter(lastVisible), limit(20));

      getDocs(q).then((snapshots) => {
        setHistoriesSnapshot(snapshots);

        let docs: object[] = [];

        snapshots.forEach((snapshot) => {
          docs.push({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });

        setHistories([...histories, ...docs]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMore = () => setPage(page + 1);
  //<h2>{history.name}</h2>
  return (
    <div>
      <Navbar backTo="/" />
      <div className="flex justify-center">
        <div className="px-10 w-full md:w-3/4 lg:w-1/2">
          <h1 className="text-4xl font-bold my-10">Histories</h1>

          <ul className="flex flex-col gap-3">
            {histories.map((history: any) => (
              <li key={history.id}>
                <div className="flex justify-between px-4 items-center hover:bg-neutral-200">
                  <span>{history.pcs}</span>
                  <span>
                    {dayjs(history.addedAt.seconds * 1000).format(
                      "dddd, mm MMMM YYYY "
                    )}
                  </span>
                </div>
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
