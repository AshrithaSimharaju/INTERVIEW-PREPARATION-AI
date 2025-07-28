import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axios from "../../utils/axiosInstance";
import { BASE_URL } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Signup = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null); // File
  const [preview, setPreview] = useState(null);       // For image preview
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!validateEmail(email)) return setError("Enter a valid email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setError("");

    let uploadedImageUrl = "";

    try {
      // Upload image if present
      if (profilePic) {
        const formData = new FormData();
        formData.append("image", profilePic);

        const uploadRes = await axios.post(`${BASE_URL}/auth/upload-image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImageUrl = uploadRes.data.imageUrl;
      }

      // Register user
      const res = await axios.post(`${BASE_URL}/auth/register`, {
        name: fullName,
        email,
        password,
        profileImageUrl: uploadedImageUrl || "",
      });

      if (res.data) {
        updateUser(res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-yellow-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Create an Account
        </h3>
        <p className="text-sm text-gray-600 text-center mb-4">
          Join us by filling the details below.
        </p>

        <form onSubmit={handleSignUp} className="space-y-5">
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* Image Upload */}
          <div className="flex flex-col items-center">
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-full mb-2 border-2 border-orange-400"
              />
            )}
            <label className="cursor-pointer bg-orange-500 text-white px-4 py-1 rounded-md hover:bg-orange-600 transition">
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!validateEmail(e.target.value)) {
                  setError("Enter a valid email address.");
                } else {
                  setError("");
                }
              }}
              className={`w-full px-4 py-2 border ${
                error && !validateEmail(email)
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-orange-400"
              } rounded-md focus:outline-none focus:ring-2`}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-500 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
