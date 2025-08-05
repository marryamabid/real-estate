import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
export default function Oauth() {
  const dispatch = useDispatch(); // Hook to access the Redux store
  async function handleGoogleClick() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await axios.post("http://localhost:3000/api/auth/google", {
        username: result.user.displayName,
        email: result.user.email,
        profileImage: result.user.photoURL,
      });
      dispatch(signInSuccess(res.data)); // Dispatch success action with user data
      console.log("response from backend", res.data);
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  }
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
}
