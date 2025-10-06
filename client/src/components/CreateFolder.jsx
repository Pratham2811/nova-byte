import React, { useState } from "react";
import { FolderPlus } from "lucide-react";

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
    }
  };

  return (
    <div className="p-6">
      {/* Button to open popup */}
      <div className="flex items-center justify-center w-16 h-16">
        <button
          onClick={() => setShowPopup(true)}
          // Added hover shadow classes here
          className="group flex items-center justify-center w-10 h-10 
                     rounded-lg transition-all duration-300 ease-in-out 
                     hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          title="Create Folder"
        >
          {/* Integrated the AnimatedGradientIcon here */}
          {/* The w-full h-full on FolderPlus inside AnimatedGradientIcon will make it fit this 10x10 button */}
          <AnimatedGradientIcon className="w-7 h-7" /> 
        </button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background Overlay */}
          <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

          {/* Popup Content */}
          <div
            className="relative bg-gray-900 backdrop-blur-xl 
                                 p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm border border-white/20 
                                 dark:border-gray-700/30"
          >
            <h4 className="text-lg font-semibold text-white mb-3">
              New Folder
            </h4>
            <p className="text-red-500 mb-2">{message}</p> {/* Added mb-2 for spacing */}
            <input
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setMessage("");
              }}
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded-md mb-4 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setFolderName("");
                  setMessage("");
                }}
                className="px-4 py-2 rounded-xl border bg-gray-400 border-gray-300 dark:border-gray-700 
                                 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDirectory}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CSS for animated gradient */}
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