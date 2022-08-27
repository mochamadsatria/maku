import { useParams } from "@remix-run/react";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "~/components/button";
import Navbar from "~/components/navbar";

export default function Page() {
  const [data, setData] = useState<any>();

  const params = useParams();

  useEffect(() => {
    const db = getFirestore();

    const docRef = doc(db, `donations/${params.donationId}`);

    getDoc(docRef).then((item) => {
      setData({
        id: item.id,
        ...item.data(),
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Navbar backTo={`/donations`} />
      {data && (
        <div className="flex flex-col lg:flex-row lg:justify-center">
          <img alt="" src={data.display} className="w-full lg:w-64" />

          <div className="flex flex-col gap-3 p-10">
            <h1 className="text-4xl font-bold">{data.name}</h1>

            <span>
              Stock{" "}
              <span className="font-bold tracking-wide text-lg">
                {data.stock}
              </span>
            </span>
            <Button>Takeaway</Button>
          </div>
        </div>
      )}
    </div>
  );
}
