import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase.js";

const OAuth = () => {
  const [loading, setLoading] = useState(false);
  const naviagte = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setLoading(true);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        }),
      });

      const data = await res.json();
      setLoading(false);
      toast.success(data.message);
      naviagte("/");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      {loading ? "Loading..." : "Sign in with Google"}
    </button>
  );
};

export default OAuth;
