// src/components/UserMenu.jsx
import React, { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";

const NEON_CYAN = "cyan-400";
const NEON_RED = "rose-500";

export const UserMenu = ({ handleViewProfile }) => {
  const MENU_COLOR = "bg-gray-900/90";
  const BORDER_COLOR = "fuchsia-600/30";

  const [username, setUsername] = useState("User");
  const [useremail, setUseremail] = useState("user@example.com");

  const navigate = useNavigate();

  // Reusable logout hook
  const { logoutUser, userLoggedOut, loading, error } = useLogout();

  const fetchUser = async () => {
    try {
      const url = "http://localhost:80/user";
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setUsername(data.username || "User");
      setUseremail(data.email || "user@example.com");
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Redirect after logout
  useEffect(() => {
    if (userLoggedOut) {
      navigate("/login"); // redirect to login page
    }
  }, [userLoggedOut, navigate]);

  return (
    <div className="absolute right-0 top-full mt-2 z-50 transform transition-all duration-200 ease-in-out origin-top-right">
      {/* Caret / Triangle */}
      <div
        className="absolute -top-3 right-3 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-fuchsia-600/30"
        aria-hidden="true"
      />
      <div
        className="absolute -top-[11px] right-3.5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gray-900/90"
        aria-hidden="true"
      />

      {/* Menu Box */}
      <div
        className={`w-56 ${MENU_COLOR} backdrop-blur-xl rounded-lg shadow-2xl shadow-fuchsia-500/10 border border-${BORDER_COLOR} overflow-hidden`}
      >
        {/* Profile Row */}
        <button
          onClick={handleViewProfile}
          className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-200 hover:bg-fuchsia-800/30 hover:text-white transition-colors duration-200 ease-in-out cursor-pointer"
        >
          <User size={18} className={`text-${NEON_CYAN} shrink-0`} />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate max-w-[160px]">{username}</span>
            <span className="text-xs text-gray-400 truncate max-w-[160px]">{useremail}</span>
          </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={logoutUser}
          disabled={loading}
          className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-200 hover:bg-rose-800/30 hover:text-white transition-colors duration-200 ease-in-out cursor-pointer"
        >
          <LogOut size={18} className={`text-${NEON_RED}`} />
          <span className="text-sm font-medium">
            {loading ? "Logging out..." : "Logout"}
          </span>
        </button>
        {error && <p className="text-xs text-red-500 px-4 py-1">{error}</p>}
      </div>
    </div>
  );
};
