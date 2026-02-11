import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, Trash2, Menu, X } from "lucide-react";
import { DirectoryView } from "@/features/directory";
import { TrashFiles } from "@/features/trash";
import { useSidebar } from "@/shared/hooks";
import { UserSidebarWidget } from "@/features/user";
import { useDispatch } from "react-redux";
import { getUser } from "@/features/auth/thunks/sessionThunk";
import { toast } from "sonner";

export const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("files");
  const { isSidebarOpen, isMobile, setIsSidebarOpen } = useSidebar();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      await dispatch(getUser()).unwrap();
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "files":
        return <DirectoryView />;
      case "trash":
        return <TrashFiles />;
      default:
        return <DirectoryView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-white border-r border-gray-200 flex flex-col
          fixed md:static inset-y-0 left-0 z-50
          transform transition-transform duration-300
          ${isSidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-24 min-h-[6rem] border-b border-gray-200 flex items-center justify-center relative">
          {/* Changes made:
              1. Removed 'px-2 py-2' from the parent div (removes container spacing).
              2. Increased 'h-20' to 'h-24' (gives it slightly more vertical room to expand).
          */}

          <img
            src={"../assets/logo4.png"}
            alt="CloudMemories Logo"
            className="w-full h-full object-contain"
          />

          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-gray-100 rounded-full transition-colors shadow-sm"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => handleTabChange("files")}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-colors duration-150 text-sm font-medium
              ${
                activeTab === "files"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <Folder size={20} />
            <span>My Files</span>
          </button>

          <button
            onClick={() => handleTabChange("trash")}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-colors duration-150 text-sm font-medium
              ${
                activeTab === "trash"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <Trash2 size={20} />
            <span>Trash</span>
          </button>
        </nav>

        {/* User Section - Now using the widget */}
        <UserSidebarWidget />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar (Mobile) */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {activeTab === "files" ? "My Files" : "Trash"}
          </h2>
        </div>

        {/* Content Area */}
        {renderContent()}
      </main>
    </div>
  );
};

export default HomePage;
