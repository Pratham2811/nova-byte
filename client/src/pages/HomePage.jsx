import React, { useState, useEffect, useRef } from "react";
// Assuming FileList and TrashFiles are the content components
import { FileList } from "@/components/DirectoryView"; 
import TrashFiles from "@/components/TrashFiles"; 

import { Folder, Trash2, Menu, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfilePage } from "./ProfilePage";
import { useNavigate } from "react-router-dom";

// Define Theme Colors
const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-400";
const NEON_RED = "rose-500";
const BG_DARK = "bg-gray-950";
const ACTIVE_GRADIENT = `bg-gradient-to-r from-cyan-500 to-fuchsia-600`;

// Placeholder for a default user image or initial
const USER_INITIAL = "AD"; 

// --- UserMenu Component with Caret (Cursor Pointer Added) ---
const UserMenu = ({ handleLogout, handleViewProfile }) => {
  const MENU_COLOR = "bg-gray-900/90";
  const BORDER_COLOR = "fuchsia-600/30";

  return (
    <div className="absolute right-0 top-full mt-2 z-50 transform transition-all duration-200 ease-in-out origin-top-right">
      
      {/* Caret/Triangle */}
      <div 
        className={`absolute -top-3 right-3 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-fuchsia-600/30`} 
        aria-hidden="true" 
      />
      {/* Inner Caret (to match the background) */}
      <div 
        className={`absolute -top-[11px] right-3.5 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gray-900/90`} 
        aria-hidden="true" 
      />

      {/* Actual Menu Box */}
      <div className={`w-52 ${MENU_COLOR} backdrop-blur-xl rounded-lg shadow-2xl shadow-fuchsia-500/10 border border-${BORDER_COLOR} overflow-hidden`}>
        <div className="p-4 border-b border-gray-800/80 text-center">
          <span className={`text-sm font-bold text-transparent bg-clip-text ${ACTIVE_GRADIENT}`}>
            Signed in as User
          </span>
        </div>
        <button
          onClick={handleViewProfile}
          className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-200 hover:bg-fuchsia-800/30 hover:text-white transition-colors duration-200 ease-in-out cursor-pointer"
        >
          <User size={18} className={`text-${NEON_CYAN}`} />
          <span className="text-sm font-medium">View Profile</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-200 hover:bg-rose-800/30 hover:text-white transition-colors duration-200 ease-in-out cursor-pointer"
        >
          <LogOut size={18} className={`text-${NEON_RED}`} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [activePage, setActivePage] = useState("files");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Reintroducing isMobile state
  const [isMobile, setIsMobile] = useState(false); 
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate=useNavigate()
  const userMenuRef = useRef(null);

  // Handle click outside for User Menu (unchanged)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // --- RESTORED: Screen size check for sidebar behavior ---
  useEffect(() => {
    const handleResize = () => {
      // Screens larger than md (768px): Desktop view
      if (window.innerWidth >= 768) {
        setIsMobile(false);
        setIsSidebarOpen(true); // Sidebar is always open on desktop
      } else {
        // Screens smaller than md: Mobile view
        setIsMobile(true);
        setIsSidebarOpen(false); // Sidebar is closed by default on mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case "files":
        return <FileList />;
      case "trash":
        return <TrashFiles />;
      default:
        return <FileList />;
    }
  };

  const getCurrentTitle = () => {
    switch (activePage) {
      case "files":
        return "My Files";
      case "trash":
        return "Trash";
      default:
        return "CYBER DRIVE";
    }
  }

  const handleLinkClick = (page) => {
    setActivePage(page);
    // Only close sidebar automatically if it's mobile
    if (isMobile) { 
      setIsSidebarOpen(false);
    }
  };

  const handleViewProfile = () => {
      navigate("/user-profile")
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setIsUserMenuOpen(false);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${BG_DARK} text-white font-sans`}>
      
      {/* Mobile Sidebar Overlay: Only appears on small screens when open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar: Logic updated for fixed (mobile overlay) or static (desktop) */}
      <aside
        className={cn(
          `bg-gray-900/90 backdrop-blur-xl border-r border-${NEON_CYAN}/30 w-64 min-w-[200px] flex-shrink-0 shadow-2xl shadow-${NEON_CYAN}/20`,
          // On mobile, it's fixed and transforms; on desktop, it's static
          "fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out",
          "md:static md:translate-x-0", // Desktop: Static, always visible
          {
            "translate-x-0": isSidebarOpen,
            "-translate-x-full": !isSidebarOpen && isMobile, // Mobile: hidden when closed
          }
        )}
      >
        <div className="p-5 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 border-b border-gray-800 tracking-wider">
          CYBER DRIVE
        </div>
        
        {/* Close Button: Only shown when acting as a temporary overlay (on mobile) */}
        {isMobile && isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white z-50 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        )}

        <nav className="flex flex-col p-4 space-y-3">
          {/* ... Files and Trash Buttons (Unchanged) ... */}
          <button
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md cursor-pointer ${
              activePage === "files"
                ? `${ACTIVE_GRADIENT} shadow-${NEON_CYAN}/40 scale-[1.03] border border-cyan-400`
                : "hover:bg-gray-800/80 hover:shadow-lg hover:shadow-gray-700/20 border border-transparent text-gray-300"
            }`}
            onClick={() => handleLinkClick("files")}
          >
            <Folder size={22} className={activePage === "files" ? "text-white" : `text-${NEON_CYAN}`} />
            <span className="tracking-wider">My Files</span>
          </button>
          
          <button
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md cursor-pointer ${
              activePage === "trash"
                ? `bg-gradient-to-r from-rose-500 to-red-700 shadow-${NEON_RED}/40 scale-[1.03] border border-rose-400`
                : "hover:bg-gray-800/80 hover:shadow-lg hover:shadow-gray-700/20 border border-transparent text-gray-300"
            }`}
            onClick={() => handleLinkClick("trash")}
          >
            <Trash2 size={22} className={activePage === "trash" ? "text-white" : `text-${NEON_RED}`} />
            <span className="tracking-wider">Trash</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP BAR: Header */}
        <div className="flex items-center p-4 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700 shadow-lg z-30">
          
          {/* LEFT: Menu Button (Hamburger) - ONLY VISIBLE ON MOBILE */}
          <div className="md:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-1 text-${NEON_CYAN} hover:text-white transition-colors cursor-pointer`}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* CENTER: Title */}
          <h1 className="flex-1 text-center text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 md:text-left md:ml-4">
            <span className="md:hidden">CYBER DRIVE</span>
            <span className="hidden md:inline-block">{getCurrentTitle()}</span>
          </h1>
          
          {/* RIGHT: User Menu Icon */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-200 cursor-pointer ${
                isUserMenuOpen 
                  ? `border-${NEON_FUCHSIA} ring-2 ring-${NEON_FUCHSIA}/50 ${ACTIVE_GRADIENT}`
                  : `border-gray-600 hover:border-${NEON_CYAN} bg-gray-700/50 text-gray-300`
              }`}
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              {USER_INITIAL} 
            </button>

            {isUserMenuOpen && (
              <UserMenu 
                handleLogout={handleLogout}
                handleViewProfile={handleViewProfile}
              />
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-fuchsia-600/50 scrollbar-track-transparent">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};