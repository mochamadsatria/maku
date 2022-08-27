import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import AuthForm from "~/components/auth/form";

import Navbar from "~/components/navbar";

export const meta: MetaFunction = () => ({
  title: "Register | Makananku Maku",
});

export default function Register() {
  const [error, setError] = useState<Error>();

  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        ).then((account) => {
          const db = getFirestore();

          const docRef = doc(db, `users/${account.user.uid}`);

          return setDoc(docRef, {
            registerAt: serverTimestamp(),
          });
        });
      })
      .then(() => {
        navigate("/");
      })
      .catch((e) => {
        setError(e);
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-white flex flex-col">
        <div className="bg-[url('/doodle/SwingingDoodle.png')] bg-no-repeat bg-left-bottom bg-50% flex-grow ">
          <AuthForm title="Register" error={error} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
