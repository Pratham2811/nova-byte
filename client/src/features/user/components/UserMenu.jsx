// src/components/UserMenu.jsx
import React, { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks";

export const UserMenu = ({ handleViewProfile }) => {
  const [username, setUsername] = useState("User");
  const [useremail, setUseremail] = useState("user@example.com");

  const navigate = useNavigate();
  const { logoutUser, userLoggedOut, loading, error } = useLogout();

  const fetchUser = async () => {
    try {
      const url = "http://localhost:80/user";
      const response = await fetch(url, { method: "GET", credentials: "include" });
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

  useEffect(() => {
    if (userLoggedOut) {
      navigate("/login");
    }
  }, [userLoggedOut, navigate]);

  return (
    <div className="absolute right-0 top-full mt-2 z-50 origin-top-right">
      {/* Menu Box */}
      <div className="w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden py-1">
        
        {/* Profile Section */}
        <div className="px-4 py-3 border-b border-gray-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-lg font-medium">
                  {username.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-gray-800 truncate">{username}</span>
                <span className="text-xs text-gray-500 truncate">{useremail}</span>
              </div>
           </div>
           <button 
              onClick={handleViewProfile}
              className="mt-3 w-full text-center py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 text-gray-700 transition-colors"
           >
              Manage your Account
           </button>
        </div>

        {/* Menu Items */}
        <div className="py-1">
            <button
            onClick={logoutUser}
            disabled={loading}
            className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
            <LogOut size={18} className="text-gray-500" />
            <span>{loading ? "Signing out..." : "Sign out"}</span>
            </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 py-2 px-4 text-xs text-gray-500 flex justify-center gap-2">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
        </div>

        {error && <p className="text-xs text-red-500 px-4 py-1">{error}</p>}
      </div>
    </div>
  );
};
