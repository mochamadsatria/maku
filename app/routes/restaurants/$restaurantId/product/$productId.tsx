import { useParams } from "@remix-run/react";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "~/components/button";
import Navbar from "~/components/navbar";

export default function Page() {
  const params = useParams();

  const [product, setProduct] = useState<any>();

  const [activeImg, setActiveImg] = useState<number>(0);

  useEffect(() => {
    const db = getFirestore();

    const coll = collection(db, `restaurants/${params.restaurantId}/products`);
    const docRef = doc(coll, params.productId);

    getDoc(docRef).then((item) => {
      setProduct({
        id: item.id,
        ...item.data(),
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar backTo={`/restaurants/${params.restaurantId}`} />
      <div className="p-10 overflow-hidden">
        {product && (
          <div className="flex flex-col lg:flex-row lg:justify-center">
            <div className="w-full md:w-48 lg:w-64 ">
              <ul>
                <img
                  alt=""
                  src={product.display[activeImg]}
                  className="w-full md:w-48 lg:w-64"
                />
              </ul>
              <ul className="grid grid-cols-4 lg:grid-cols-5 ">
                {product.display.map((item: string, index: number) => (
                  <li key={item}>
                    <button onClick={() => setActiveImg(index)}>
                      <img
                        alt=""
                        src={item}
                        className={index == activeImg ? "" : "opacity-80"}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-4xl font-bold tracking-wide">
                {product.name}
              </h2>
              <span>
                Stock:{" "}
                <span className="font-bold tracking-wide text-lg">
                  {product.stock}
                </span>
              </span>
              <Button>Add to cart</Button>
              <Button>Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
