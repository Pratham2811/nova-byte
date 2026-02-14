import React, { useEffect, useState } from "react";
import { Folder, Trash2, Menu, X, Cloud } from "lucide-react";
import { DirectoryView } from "@/features/directory";
import { TrashFiles } from "@/features/trash";
import { useSidebar } from "@/shared/hooks";
import { UserSidebarWidget } from "@/features/user";
import { useDispatch } from "react-redux";
import { getUser } from "@/features/auth/thunks/sessionThunk";
import { toast } from "sonner";
import { cn } from "@/lib/utils"; // Assuming you have this utility

export const HomePage = () => {
  const [activeTab, setActiveTab] = useState("files");
  const { isSidebarOpen, isMobile, setIsSidebarOpen } = useSidebar();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      await dispatch(getUser()).unwrap();
    } catch (error) {
      // Silent fail or low priority toast
      console.error(error);
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

  // Helper for Nav Items
  const NavItem = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => handleTabChange(id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-indigo-50 text-indigo-700" 
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        )}
      >
        <Icon size={18} className={cn(isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#F5F7FA] overflow-hidden font-sans">
      
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none",
          isSidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                <Cloud size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">CloudMemories</span>
          </div>

          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          <NavItem id="files" label="My Files" icon={Folder} />
          <NavItem id="trash" label="Trash" icon={Trash2} />
        </nav>

        {/* User Widget (Pinned to bottom) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <UserSidebarWidget />
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F5F7FA]">
        
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-slate-900">
            {activeTab === "files" ? "My Files" : "Trash"}
          </span>
        </div>

        {/* Actual View Content */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default HomePage;