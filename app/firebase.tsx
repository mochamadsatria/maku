import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD0C5va07srXUGB_mpfBlB5eXWU-0ziCuk",
  authDomain: "maku-a77ea.firebaseapp.com",
  databaseURL:
    "https://maku-a77ea-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "maku-a77ea",
  storageBucket: "maku-a77ea.appspot.com",
  messagingSenderId: "1043419372238",
  appId: "1:1043419372238:web:80e0a71d0fffa3adf68e9f",
  measurementId: "G-TB0LC5WHWQ",
};

const app = initializeApp(firebaseConfig);

export default app;
