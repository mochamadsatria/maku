import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import AuthForm from "~/components/auth/form";

export default function Register() {
  const [error, setError] = useState<Error>();

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
      .catch((e) => {
        setError(e);
      });
  };

  return <AuthForm title="Register" error={error} onSubmit={onSubmit} />;
}
