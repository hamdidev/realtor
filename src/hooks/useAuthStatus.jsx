import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
// import { auth } from "../firebase";

export function useAuthStatus() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkStatus, setCheckStatus] = useState(true);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      setCheckStatus(false);
    });
  }, []);

  return { loggedIn, checkStatus };
}
