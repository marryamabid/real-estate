import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(false); // State to handle loading state
  const navigate = useNavigate(); // Hook to programmatically navigate
  function handleChange(e) {
    const { id, value } = e.target; // Destructure id and value from the event target
    setFormData((prev) => ({ ...prev, [id]: value })); // Update the state with the new value
    console.log(formData); // For debugging purposes, can be removed later
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Reset error state
    try {
      const result = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData
      );
      console.log(result);
      setFormData({}); // Reset form data after successful submission
      navigate("/sign-in"); // Navigate to sign-in page after successful signup
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Always stop loading after try/catch
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="border p-3 rounded-lg"
          placeholder="username"
          type="text"
          id="username"
          onChange={handleChange}
        />
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}{" "}
    </div>
  );
}
