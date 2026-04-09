import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuriigk_hHD9AvmyWU3dMUFyt5PDpWH6M",
  authDomain: "hifz-journey-415e3.firebaseapp.com",
  projectId: "hifz-journey-415e3",
  storageBucket: "hifz-journey-415e3.firebasestorage.app",
  messagingSenderId: "509430563138",
  appId: "1:509430563138:web:7f7052776410d7893a08db",
  measurementId: "G-BSNV22CMNE",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
