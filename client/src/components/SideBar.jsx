import React from "react";
import { Folder, Upload, Trash2 } from "lucide-react";

// Define Theme Colors/Styles
const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-400";
const NEON_RED = "rose-500";
const ACTIVE_GRADIENT = `bg-gradient-to-r from-cyan-500 to-fuchsia-600`;
const TRASH_GRADIENT = `bg-gradient-to-r from-rose-500 to-red-700`;

const SideBar = ({ setActiveTab, activeTab }) => {
  
  const getButtonClass = (tabName, gradientClass, iconColor) => {
    const isActive = activeTab === tabName;
    
    return `
      flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md border border-transparent
      ${isActive 
        ? `${gradientClass} shadow-lg shadow-${isActive ? NEON_FUCHSIA : NEON_CYAN}/40 scale-[1.03] border-opacity-100`
        : `hover:bg-gray-800/80 hover:shadow-lg hover:shadow-gray-700/20 text-gray-300 hover:text-white`
      }
    `;
  };

  return (
    // Sidebar Container: Dark background, glass-like effect, sharp border
    <div className={`
        w-60 min-w-[240px] bg-gray-900/90 backdrop-blur-md text-white p-5 space-y-4 
        border-r border-${NEON_CYAN}/30 shadow-2xl shadow-black/50 h-full flex flex-col
    `}>
      {/* Title/Logo: Neon Gradient */}
      <h2 className={`
        text-2xl font-extrabold mb-4 pb-3 border-b border-gray-800 tracking-wider
        text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400
      `}>
        CYBER DRIVE
      </h2>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-3 flex-grow">
        
        {/* Files Button (Main Gradient) */}
        <button
          onClick={() => setActiveTab("files")}
          className={getButtonClass("files", ACTIVE_GRADIENT, NEON_CYAN)}
        >
          <Folder size={20} className={activeTab === "files" ? "text-white" : `text-${NEON_CYAN}`} />
          <span className="tracking-wider">Files</span>
        </button>
        
        {/* Upload Button (Secondary Gradient/Accent) */}
        <button
          onClick={() => setActiveTab("upload")}
          className={getButtonClass("upload", `bg-purple-600 hover:bg-purple-700`, 'purple-400')}
        >
          <Upload size={20} className={activeTab === "upload" ? "text-white" : `text-purple-400`} />
          <span className="tracking-wider">Upload</span>
        </button>

        {/* Trash Button (Warning/Red Gradient) */}
        <button
          onClick={() => setActiveTab("trash")}
          className={getButtonClass("trash", TRASH_GRADIENT, NEON_RED)}
        >
          <Trash2 size={20} className={activeTab === "trash" ? "text-white" : `text-${NEON_RED}`} />
          <span className="tracking-wider">Trash File</span>
        </button>
      </nav>
      
      {/* Footer/System Info (Aesthetic addition) */}
      <div className="pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500">
              STATUS: <span className={`text-${NEON_CYAN}`}>ONLINE</span>
          </p>
          <p className="text-xs text-gray-500">
              VERSION: <span className="text-gray-400">0.9.1 BETA</span>
          </p>
      </div>
    </div>
  );
};

export default SideBar;