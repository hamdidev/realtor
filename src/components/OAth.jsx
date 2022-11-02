import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";

const OAth = () => {
  const navigate = useNavigate();
  const onGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not authorize with Google.");
      console.log(error);
    }
  };
  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="flex justify-center items-center w-full bg-red-700 text-white px-7 py-3 rounded text-sm font-medium uppercase hover:bg-red-800 active:bg-red-900 transition duration-200 ease-in-out"
    >
      <FcGoogle className="mr-2 text-2xl " />
      Continue with Google
    </button>
  );
};

export default OAth;
