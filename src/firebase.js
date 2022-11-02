import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoy4El4F2Y5Hh0KmHhTzmYuTfgvMszPqk",
  authDomain: "realtor-5300f.firebaseapp.com",
  projectId: "realtor-5300f",
  storageBucket: "realtor-5300f.appspot.com",
  messagingSenderId: "245643686894",
  appId: "1:245643686894:web:d8169b6cca0d387d2c14ff",
};
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
