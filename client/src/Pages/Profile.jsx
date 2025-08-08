import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";
import { data } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({});
  const [uploadPercent, setUploadPercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // ✅ Handle image upload to Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFileUploadError(true);
      setUploadPercent(0);
      return;
    }

    const formImage = new FormData();
    formImage.append("file", file);
    formImage.append("upload_preset", "profile_upload");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/df14gd1tp/image/upload",
        formImage,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadPercent(percentCompleted);
          },
        }
      );
      setFormData({ ...formData, profileImage: response.data.secure_url });
      setFileUploadError(false);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setFileUploadError(true);
    }
  };

  // ✅ Handle input field changes
  const handleUpdateChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // include cookies for auth
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      console.log("Updated user data:", data.user);
      dispatch(updateUserSuccess(data.user));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // ✅ Auto-clear success message after 3 seconds
  useEffect(() => {
    if (updateSuccess) {
      const timeout = setTimeout(() => setUpdateSuccess(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [updateSuccess]);

  const handleUserDelete = async () => {
    try {
      deleteUserStart();
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include", // include cookies for auth
      });
      const data = await res.json();
      if (data.success === false) {
        deleteUserFailure(data.message);
        return;
      }
      alert(data.message);
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      deleteUserFailure(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold text-center my-4">Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Profile image preview */}
        <img
          onClick={() => fileInputRef.current?.click()}
          src={formData.profileImage || currentUser?.profileImage}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        {/* Upload progress or error */}
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error uploading image (must be less than 2MB)
            </span>
          ) : uploadPercent > 0 && uploadPercent < 100 ? (
            <span className="text-slate-700">{`Uploading ${uploadPercent}%...`}</span>
          ) : uploadPercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully!</span>
          ) : null}
        </p>

        {/* Username */}
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.username}
          onChange={handleUpdateChange}
        />

        {/* Email */}
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser?.email}
          onChange={handleUpdateChange}
        />

        {/* Password (new only) */}
        <input
          type="password"
          id="password"
          placeholder="New Password"
          className="border p-3 rounded-lg"
          onChange={handleUpdateChange}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      {/* Placeholder actions */}
      <div className="flex justify-between mt-5">
        <span
          onClick={handleUserDelete}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {updateSuccess && (
        <p className="text-green-700">User updated successfully!</p>
      )}
    </div>
  );
}
