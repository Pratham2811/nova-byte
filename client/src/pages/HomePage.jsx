import React, { useState } from "react";
import { UploadForm } from "@/components/UploadForm";
import { FileList } from "@/components/DirectoryView";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import TrashFiles from "@/components/TrashFiles";
export const HomePage = () => {
  const [activePage, setActivePage] = useState("files");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Changed to false by default for mobile
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size to handle sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      // For screens larger than md (768px), sidebar is always open
      if (window.innerWidth >= 768) {
        setIsMobile(false);
        setIsSidebarOpen(true);
      } else {
        setIsMobile(true);
        setIsSidebarOpen(false);
      }
    };

    // Initial check on component mount
    handleResize();
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    // Cleanup function to remove event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case "upload":
        return <UploadForm />;
      case "files":
        return <FileList />;
      case "trash":
        return <TrashFiles />;
      default:
        return <FileList />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white font-sans">
      {/* Mobile sidebar overlay (appears when sidebar is open) */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-gray-900/80 backdrop-blur-md border-r border-gray-700 w-64 min-w-[200px] flex-shrink-0",
          "fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out",
          "md:static md:translate-x-0",
          {
            "translate-x-0": isSidebarOpen,
            "-translate-x-full": !isSidebarOpen,
          }
        )}
      >
        <div className="p-5 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          My Drive
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          <button
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
              activePage === "files"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg scale-105"
                : "hover:bg-gray-800/50"
            }`}
            onClick={() => {
              setActivePage("files");
              if (isMobile) {
                setIsSidebarOpen(false);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-folder"
            >
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
            </svg>

            <span className="font-semibold"></span>
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
              activePage === "upload"
                ? "bg-gradient-to-r from-green-500 to-teal-600 shadow-lg scale-105"
                : "hover:bg-gray-800/50"
            }`}
            onClick={() => {
              setActivePage("upload");
              if (isMobile) {
                setIsSidebarOpen(false);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-upload"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <span className="font-semibold"></span>
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
              activePage === "trash"
                ? "bg-gradient-to-r from-red-300 to-red-500 shadow-lg scale-105"
                : "hover:bg-gray-800/50"
            }`}
            onClick={() => {
              setActivePage("trash");
              if (isMobile) {
                setIsSidebarOpen(false);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-trash"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            <span className="font-semibold"></span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar (Mobile only) */}
        <div className="md:hidden flex items-center p-4 bg-gray-900/70 backdrop-blur-md border-b border-gray-700">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-300 hover:text-white"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            My Drive
          </h1>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
