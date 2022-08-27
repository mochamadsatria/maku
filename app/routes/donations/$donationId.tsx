import { useParams } from "@remix-run/react";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Button from "~/components/button";
import Navbar from "~/components/navbar";

import Map, { Marker } from "react-map-gl";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGF6ZWxoYW5kcmF0YSIsImEiOiJjbDc5NTl5dzUwZzd0M3FzY21jNHBrcTZ4In0.lIcMlK8oXVc4ftv8pc84rg";

export default function Page() {
  const [data, setData] = useState<any>();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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
    <div className="overflow-hidden max-h-screen relative">
      <div className="relative z-40">
        <Navbar backTo="/donations" />
      </div>

      {data && (
        <>
          <div className="relative z-0">
            <Map
              initialViewState={{
                latitude: data.address._lat,
                longitude: data.address._long,
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
                longitude={data.address._long}
                latitude={data.address._lat}
                color="red"
              />
            </Map>
          </div>
          <div className="w-screen">
            <div
              className={`absolute z-40 bottom-0 ${
                menuOpen ? "h-1/2" : "h-1/4"
              } hover:h-1/2 transform duration-150 bg-white w-full overflow-y-scroll`}
            >
              <button
                className="w-full mb-3 pt-10"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FontAwesomeIcon icon={faChevronUp} />
              </button>
              <div className="flex flex-col-reverse lg:flex-row lg:justify-center">
                <img alt="" src={data.display} className="w-full lg:w-64" />

                <div className="flex flex-col gap-3 p-10">
                  <h1 className="text-4xl font-bold">{data.name}</h1>
                  <span>{data.displayAddress}</span>
                  <span>
                    Stock{" "}
                    <span className="font-bold tracking-wide text-lg">
                      {data.stock}
                    </span>
                  </span>
                  <Button>Takeaway</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
