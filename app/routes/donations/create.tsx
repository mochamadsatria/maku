import { useForm } from "react-hook-form";
import Button from "~/components/button";
import Navbar from "~/components/navbar";

import { aleaRNGFactory } from "number-generator";
import { doc, GeoPoint, getFirestore, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  title: "Create donation | Makananku Maku",
});

export default function CreateDonation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = (data: any) => {
    const file = data.display[0];

    const storage = getStorage();

    const { uInt32 } = aleaRNGFactory();
    const name = `${uInt32()}-${(data.name as string)
      .toLowerCase()
      .replace(" ", "-")}`;

    const lastDot = file.name.lastIndexOf(".");

    const fileName = file.name
      .substring(0, lastDot)
      .toLowerCase()
      .replace(" ", "-");

    const ext = file.name.substring(lastDot + 1);

    const storageRef = ref(storage, `donations/${name}-${fileName}.${ext}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //const progress =
        //Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const db = getFirestore();
          const auth = getAuth();

          const docRef = doc(db, `donations/${name}`);

          const gr = async () => {
            const a = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${data.displayAddress}.json?access_token=pk.eyJ1IjoiaGF6ZWxoYW5kcmF0YSIsImEiOiJjbDc5NTl5dzUwZzd0M3FzY21jNHBrcTZ4In0.lIcMlK8oXVc4ftv8pc84rg`
            );

            return await a.json();
          };

          const geodata = await gr();

          const latlong = geodata.features[0].center;

          delete data.display;

          return setDoc(
            docRef,
            {
              ...data,
              address: new GeoPoint(latlong[1], latlong[0]),
              display: downloadURL,
              owner: auth.currentUser?.uid,
              takeAwayHistory: [],
            },
            {
              merge: true,
            }
          ).then(() => {
            reset();
            alert("Success insert data, now the form will resetting!");
          });
        });
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar backTo="/donations" />
      <div className="flex justify-center flex-grow bg-[url('/doodle/CoffeeDoddle.png')] bg-no-repeat bg-left-bottom bg-50%">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 xl:w-1/3 bg-white md:shadow-lg md:border rounded-lg h-min"
        >
          <fieldset className="flex flex-col gap-5 p-10">
            <h1 className="text-4xl font-bold">Create new donation</h1>

            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Name"
            />
            <input
              type="number"
              {...register("stock", { required: true })}
              placeholder="Stock"
            />
            <select
              {...register("type", { required: true })}
              defaultValue={"food"}
              placeholder="Type"
            >
              <option value={"food"}>Food</option>
              <option value={"beverage"}>Beverage</option>
            </select>

            <input
              type="text"
              {...register("displayAddress", { required: true })}
              placeholder="Address"
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="display" className="font-medium">
                Picture
              </label>
              <input
                type="file"
                {...register("display", { required: true })}
                id="display"
              />
            </div>

            <label className="flex items-center gap-5">
              <input type="checkbox" {...register("published")} />
              <span>Published</span>
            </label>
            <Button type="submit">Submit</Button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
