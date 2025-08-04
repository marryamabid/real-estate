import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/store/user/user";
import { useDispatch, useSelector } from "react-redux";

export default function SignIp() {
  const [formData, setFormData] = useState({});

  const navigate = useNavigate(); // Hook to programmatically navigate

  const dispatch = useDispatch(); // Hook to access the Redux store
  const { loading, error } = useSelector((state) => state.user); // Access the user state from

  function handleChange(e) {
    const { id, value } = e.target; // Destructure id and value from the event target
    setFormData((prev) => ({ ...prev, [id]: value })); // Update the state with the new value
    console.log(formData); // For debugging purposes, can be removed later
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const result = await axios.post(
        "http://localhost:3000/api/auth/signin",
        formData
      );
      if (result.data.success === false) {
        dispatch(signInFailure(result.data.message));
        return;
      }
      console.log(result.data);
      dispatch(signInSuccess(result.data)); // Dispatch success action with user data
      navigate("/"); // Navigate to sign-in page after successful signup
    } catch (err) {
      console.log(err);
      const errorMsg = err.response?.data?.message || "Something went wrong";
      dispatch(signInFailure(errorMsg));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border p-3 rounded-lg"
          placeholder="email"
          type="email"
          id="email"
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg"
          placeholder="password"
          type="password"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
    </div>
  );
}
