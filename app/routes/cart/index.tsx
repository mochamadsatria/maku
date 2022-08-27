import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  limit,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  increment,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import Button from "~/components/button";
import Navbar from "~/components/navbar";

function EmptyCart() {
  return <div></div>;
}

export default function Page() {
  const [cartData, setCartData] = useState<object[]>([]);

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();

    // ${auth.currentUser.uid}

    const coll = collection(db, `users/d9gVpTlLfhl98UGEPA3B/cart`);
    const q = query(coll);

    getDocs(q).then((snapshots) => {
      snapshots.forEach(async (snapshot) => {
        const data = snapshot.data();

        const docRef = doc(
          db,
          `restaurants/${data.restaurantId}/products/${data.productId}`
        );

        await getDoc(docRef).then((docItem) => {
          setCartData((prevState) => [
            ...prevState,
            {
              id: snapshot.id,
              meta: data,
              ...docItem.data(),
            },
          ]);
        });
      });
    });
  }, []);

  const increasePcs = (id: string) => {
    const db = getFirestore();

    const docRef = doc(db, `users/d9gVpTlLfhl98UGEPA3B/cart/${id}`);

    updateDoc(docRef, { pcs: increment(1) });
  };

  const decreasePcs = (id: string, now: number, index: number) => {
    const db = getFirestore();

    const docRef = doc(db, `users/d9gVpTlLfhl98UGEPA3B/cart/${id}`);

    if (now == 1) {
      deleteDoc(docRef).then(() => {
        let data = cartData;
        data.splice(index);

        setCartData(data);
      });
    } else {
      updateDoc(docRef, { pcs: increment(-1) });
    }
  };

  return (
    <div>
      <Navbar backTo="/" />
      <div className="p-10 flex flex-col gap-5">
        <h1 className="text-4xl font-bold">Cart</h1>
        {cartData.length < 1 ? (
          <div>Loading...</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {cartData.map((data: any, index: number) => (
              <li
                key={`${data.id}-${index}`}
                className="flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold text-lg">{data.name}</h2>

                  <div>{data.price}</div>
                </div>
                <div className="flex items-center overflow-hidden">
                  <span className="px-4 ">Pcs: {data.meta.pcs}</span>
                  <button
                    key={`${data.id}-incr`}
                    onClick={() => increasePcs(data.id)}
                    className="font-bold text-2xl py-2 px-3 hover:bg-neutral-200 focus:bg-neutral-200"
                  >
                    +
                  </button>
                  <button
                    key={`${data.id}-decr`}
                    onClick={() => decreasePcs(data.id, data.meta.pcs, index)}
                    className="font-bold text-2xl py-2 px-3 hover:bg-neutral-200 focus:bg-neutral-200"
                  >
                    -
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Button>Checkout</Button>
      </div>
    </div>
  );
}
