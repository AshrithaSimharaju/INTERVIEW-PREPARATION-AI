import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const ProfileInfoCard = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ Safe fallback for image URL
  const validImageUrl =
    user?.profileImageUrl &&
    (user.profileImageUrl.startsWith("blob:") || user.profileImageUrl.startsWith("http"))
      ? user.profileImageUrl
      : "/default-avatar.png"; // replace with your local default image if needed

  return (
    user && (
      <div className="flex items-center">
        <img
          src={validImageUrl}
          alt="Profile"
          className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
        />
        <div>
          <div className="text-[15px] text-black font-bold leading-3">
            {user?.name || "Guest"}
          </div>
          <button
            onClick={handleLogout}
            className="text-amber-600 text-sm font-medium hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;
