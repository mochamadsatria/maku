import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import AuthForm from "~/components/auth/form";
import Navbar from "~/components/navbar";

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-white flex flex-col">
        <div className="bg-[url('/doodle/DancingDoodle.png')] bg-no-repeat bg-left-bottom bg-50% flex-grow ">
          <AuthForm title="Login" error={error} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
