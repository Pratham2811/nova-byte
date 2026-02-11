import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown, Settings } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";


/**
 * UserSidebarWidget - Shows user info in sidebar with dropdown menu
 */
export const UserSidebarWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user, isLoading } = useSelector((state) => {
    return state.auth;
  });

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success("user logged out");
      navigate("/login");
    } else {
      toast.error("failed to logout");
    }
  };
if (isLoading) {
  return <div>Loading...</div>;
}

if (!user) {
  return null;
}
  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-32 mt-1 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  // if (!isAuthenticated || !user) {
  //     return (
  //         <div className="p-4 border-t border-gray-200">
  //             <button
  //                 onClick={() => navigate("/login")}
  //                 className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
  //             >
  //                 <User size={18} />
  //                 Sign In
  //             </button>
  //         </div>
  //     );
  // }

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-4 border-t border-gray-200 relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        {/* {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {getInitials(user.name)}
                    </div>
                )} */}

        {/* User Info */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name || user.user.name || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.email || user.user.email}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            ref={dropdownRef}
            className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <button
              onClick={() => {
                navigate("/user-profile");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings size={16} />
              Profile Settings
            </button>

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserSidebarWidget;
