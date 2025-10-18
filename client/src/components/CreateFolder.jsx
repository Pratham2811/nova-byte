import React, { useState } from "react";
import { FolderPlus } from "lucide-react";

// Theme Constants
const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-400";
const BG_MODAL = "bg-gray-900/95";
const BORDER_DARK = "border-gray-700/50";
const CONFIRM_GRADIENT = `bg-gradient-to-r from-cyan-500 to-fuchsia-600`;

// Animated gradient for icon
// This component now specifically applies the gradient to the text/icon
const AnimatedGradientIcon = ({ className }) => (
  // The span is responsible for the gradient effect
  <span
    className={`inline-block animate-gradient-x bg-gradient-to-r from-pink-500 via-blue-400 to-purple-500 bg-clip-text text-transparent ${className || ''}`}
    // WebkitBackgroundClip is for browser compatibility for text-transparent
    style={{ WebkitBackgroundClip: "text", backgroundClip: "text" }}
  >
    {/* The FolderPlus icon will inherit the text color from the span, which is the gradient */}
    <FolderPlus className="w-full h-full text-white cursor-pointer" /> {/* Make the icon fill its parent span */}
  </span>
);

const CreateFolder = ({ directoryPath, fetchFiles }) => {
  const [folderName, setFolderName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  console.log("directory id:",directoryPath);

  const handleDirectory = async () => {
    if (!folderName.trim()) {
      setMessage("Enter valid Folder Name");
      return;
    }

    try {
      const response = await fetch("http://localhost:80/directory/create-directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentDirId: directoryPath, foldername: folderName.trim() }),
      });

      if (!response.ok) throw new Error("Error creating directory");

      const data = await response.text();
      console.log(data);

      setFolderName("");
      setShowPopup(false);
      fetchFiles();
    } catch (err) {
      console.error(err);
      setMessage("Failed to create folder. Check server response.");
    }
  };

  return (
    <div className="p-6">
      {/* Button to open popup - Styled for Cyberpunk theme */}
      <div className="flex items-center justify-center w-16 h-16">
        <button
          onClick={() => { setShowPopup(true); setMessage(""); }} // Clear message on open
          className="group flex items-center justify-center w-10 h-10 p-2 
                     rounded-lg transition-all duration-300 ease-in-out bg-gray-800/50 
                     hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 
                     focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-70"
          title="Create Folder"
        >
          {/* Integrated the AnimatedGradientIcon here */}
          <AnimatedGradientIcon className="w-6 h-6" /> 
        </button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300">
          {/* Background Overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-black/70" onClick={() => setShowPopup(false)} />

          {/* Popup Content: Cyberpunk styling */}
          <div
            className={`relative ${BG_MODAL} p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm border ${BORDER_DARK} 
                        transform transition-all duration-300`}
          >
            {/* Title with Neon Gradient */}
            <h4 
              className={`text-xl font-extrabold mb-4 pb-2 border-b border-gray-800 tracking-wider
                          text-transparent bg-clip-text ${CONFIRM_GRADIENT}`}
            >
              NEW FOLDER INITIATED
            </h4>
            
            {/* Message Area */}
            {message && <p className="text-rose-500 mb-3 text-sm font-medium">{message}</p>} 
            
            {/* Input Field: Dark, accented focus ring */}
            <input
              type="text"
              placeholder="Enter folder name (e.g. PROJECT_NEO)"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDirectory();
              }}
              className={`w-full p-3 bg-gray-800/70 text-white border border-gray-700 rounded-lg mb-6 
                          focus:outline-none focus:ring-2 focus:ring-${NEON_CYAN} placeholder-gray-500 shadow-inner`}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              {/* Cancel Button: Standard dark button */}
              <button
                onClick={() => {
                  setShowPopup(false);
                  setFolderName("");
                  setMessage("");
                }}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200"
              >
                CANCEL
              </button>

              {/* Confirm Button: Neon Gradient */}
              <button
                onClick={handleDirectory}
                className={`px-5 py-2 text-sm font-bold rounded-lg text-gray-900 transition-all duration-300 
                            transform hover:scale-[1.05] shadow-lg ${CONFIRM_GRADIENT} shadow-${NEON_FUCHSIA}/50`}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for animated gradient - Keep this outside the component logic but in the return */}
      <style>
        {`
          @keyframes gradient-x {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default CreateFolder;