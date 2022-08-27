import type { MetaFunction } from "@remix-run/node";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
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

export const meta: MetaFunction = () => ({
  title: "Cart | Makananku Maku",
});

export default function Page() {
  const [cartData, setCartData] = useState<object[]>([]);

  const [isClient, setIsClient] = useState<boolean>(false);

  const [checkedOut, setCheckout] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();

    // ${auth.currentUser.uid}

    const coll = collection(db, `users/${auth.currentUser?.uid}/cart`);
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

  useEffect(() => {
    console.log(cartData);
  }, [cartData]);

  const increasePcs = (id: string) => {
    const db = getFirestore();
    const auth = getAuth();
    const docRef = doc(db, `users/${auth.currentUser?.uid}/cart/${id}`);

    updateDoc(docRef, { pcs: increment(1) });
  };

  const decreasePcs = (id: string, now: number, index: number) => {
    const db = getFirestore();
    const auth = getAuth();
    const docRef = doc(db, `users/${auth.currentUser?.uid}/cart/${id}`);

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
    <div className="flex flex-col min-h-screen">
      <Navbar backTo="/" />
      {checkedOut && (
        <span className="bg-red-200 py-2 px-4 flex justify-center ">
          <span>This is the end of available operations: Checked out!</span>
        </span>
      )}
      <div className="flex justify-center bg-[url('/doodle/UnboxingDoodle.png')] bg-no-repeat bg-left-bottom bg-50% flex-grow">
        <div className="p-10 flex flex-col gap-5 w-full lg:w-1/2 xl:w-1/3 bg-white rounded-lg md:shadow-lg md:border h-min md:mt-10">
          <h1 className="text-4xl font-bold">Cart</h1>
          {isClient && (
            <>
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
                          onClick={() =>
                            decreasePcs(data.id, data.meta.pcs, index)
                          }
                          className="font-bold text-2xl py-2 px-3 hover:bg-neutral-200 focus:bg-neutral-200"
                        >
                          -
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          <Button onClick={() => setCheckout(true)}>Checkout</Button>
        </div>
      </div>
    </div>
  );
}
