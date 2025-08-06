import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import axios from "axios";
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [imageURL, setImageURL] = useState(currentUser?.profileImage || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile_upload");
    try {
      setUploading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/df14gd1tp/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadPercent(percentCompleted); //
          },
        }
      );
      console.log(response);
      setImageURL(response.data.secure_url);
      setUploading(false);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setFileUploadError(true);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h2 className="text-3xl font-semibold text-center my-4">Profile</h2>
      <form className="flex flex-col gap-4">
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <img
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          src={imageURL || currentUser?.profileImage}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : uploadPercent > 0 && uploadPercent < 100 ? (
            <span className="text-slate-700">{`Uploading ${uploadPercent}%`}</span>
          ) : uploadPercent === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {uploading && (
            <p className="text-center text-sm text-gray-500">Uploading...</p>
          )}{" "}
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
