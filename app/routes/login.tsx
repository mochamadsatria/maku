import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import AuthForm from "~/components/auth/form";

export default function Login() {
  const [error, setError] = useState<Error>();

  const onSubmit = (data: any) => {
    const auth = getAuth();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, data.email, data.password);
      })
      .catch((e) => {
        setError(e);
      });
  };

  return <AuthForm title="Login" error={error} onSubmit={onSubmit} />;
}
