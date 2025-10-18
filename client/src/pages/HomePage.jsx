import React, { useState, useEffect } from "react";
// Assuming FileList and TrashFiles are the content components
import { FileList } from "@/components/DirectoryView";
import TrashFiles from "@/components/TrashFiles";

import { Folder, Trash2, Menu, X } from "lucide-react"; // Imported X for close button
import { cn } from "@/lib/utils"; // Tailwind utility class merger

// Define Theme Colors
const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-400";
const NEON_RED = "rose-500";
const BG_DARK = "bg-gray-950";
const ACTIVE_GRADIENT = `bg-gradient-to-r from-cyan-500 to-fuchsia-600`;
const TRASH_GRADIENT = `bg-gradient-to-r from-rose-500 to-red-700`;

export const HomePage = () => {
  const [activePage, setActivePage] = useState("files");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size to handle sidebar behavior
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

  const handleLinkClick = (page) => {
    setActivePage(page);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    // Updated background for deepest black
    <div className={`flex h-screen overflow-hidden ${BG_DARK} text-white font-sans`}>
      
      {/* Mobile Sidebar Overlay: Deeper and more blurred */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar: Glassmorphism and Neon Border */}
      <aside
        className={cn(
          `bg-gray-900/90 backdrop-blur-xl border-r border-${NEON_CYAN}/30 w-64 min-w-[200px] flex-shrink-0 shadow-2xl shadow-${NEON_CYAN}/20`,
          "fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out",
          "md:static md:translate-x-0",
          {
            "translate-x-0": isSidebarOpen,
            "-translate-x-full": !isSidebarOpen,
          }
        )}
      >
        {/* Logo/Title: Neon Gradient */}
        <div className="p-5 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 border-b border-gray-800 tracking-wider">
          CYBER DRIVE
        </div>
        
        {/* Close Button (Mobile Only) */}
        {isMobile && (
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-white z-50 transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex flex-col p-4 space-y-3">
          
          {/* Files Button (Main Gradient) */}
          <button
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
              activePage === "files"
                ? `${ACTIVE_GRADIENT} shadow-${NEON_CYAN}/40 scale-[1.03] border border-cyan-400`
                : "hover:bg-gray-800/80 hover:shadow-lg hover:shadow-gray-700/20 border border-transparent text-gray-300"
            }`}
            onClick={() => handleLinkClick("files")}
          >
            <Folder size={22} className={activePage === "files" ? "text-white" : `text-${NEON_CYAN}`} />
            <span className="tracking-wider">My Files</span>
          </button>
          
          {/* Trash Button (Red Gradient) */}
          <button
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md ${
              activePage === "trash"
                ? `${TRASH_GRADIENT} shadow-${NEON_RED}/40 scale-[1.03] border border-rose-400`
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
      <main className="flex-1 flex flex-col md:ml-0 overflow-hidden">
        
        {/* Top Bar (Mobile only) */}
        <div className="md:hidden flex items-center p-4 bg-gray-900/90 backdrop-blur-xl border-b border-gray-700 shadow-lg z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-1 text-${NEON_CYAN} hover:text-white transition-colors`}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          {/* Centered Mobile Title */}
          <h1 className="flex-1 text-center text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
            CYBER DRIVE
          </h1>
          {/* Spacer to center title correctly */}
          <div className="w-6"></div> 
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-fuchsia-600/50 scrollbar-track-transparent">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};