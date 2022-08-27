import { useForm } from "react-hook-form";
import Button from "~/components/button";
import Navbar from "~/components/navbar";

import { aleaRNGFactory } from "number-generator";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";

export default function CreateDonation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    const file = data.display[0];

    const storage = getStorage();

    const storageRef = ref(storage, `donations/${file.name}`);
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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const { uInt32 } = aleaRNGFactory(10);

          const db = getFirestore();
          const auth = getAuth();

          const docRef = doc(
            db,
            `donations/${uInt32()}-${(data.name as string)
              .toLowerCase()
              .replace(" ", "-")}`
          );

          delete data.display;

          setDoc(
            docRef,
            {
              ...data,
              display: downloadURL,
              owner: auth.currentUser?.uid,
              takeAwayHistory: [],
            },
            {
              merge: true,
            }
          );
        });
      }
    );
  };

  return (
    <div>
      <Navbar backTo="/donations" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="flex flex-col gap-3 p-10">
          <h1 className="text-4xl font-bold">Create new donation</h1>

          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Name"
          />
          <input
            type="textnumber"
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
            {...register("address", { required: true })}
            placeholder="Address"
          />
          <label>Picture</label>
          <input type="file" {...register("display", { required: true })} />

          <label className="flex items-center gap-5">
            <input
              type="checkbox"
              {...register("published", { required: true })}
            />
            <span>Published</span>
          </label>
          <Button type="submit">Submit</Button>
        </fieldset>
      </form>
    </div>
  );
}
