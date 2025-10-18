// RenamePopup.jsx
import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";

// Define Theme Colors/Styles
const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-500";
const NEON_GREEN = "emerald-500";

export const RenameFile = ({ fileName, onClose, OnRenameConfirm }) => {
  const [newFileName, setNewFileName] = useState(fileName);

  // Set initial state only once on component mount
  useEffect(() => {
    setNewFileName(fileName);
  }, [fileName]);

  // Handle Enter key submission
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (newFileName.trim() && newFileName !== fileName) {
        OnRenameConfirm(newFileName);
      }
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Logic to handle button click
  const handleSave = () => {
    // Only proceed if the new name is not empty and is different from the old name
    if (newFileName.trim() && newFileName !== fileName) {
      // Note: Removed 'fileName' as the second argument from the call, 
      // relying on the parent component's state (which has the item ID) to identify the file/folder.
      OnRenameConfirm(newFileName);
    } else {
      // Optionally show a validation error here
      onClose(); 
    }
  };
 
  return (
    // Backdrop: Semi-transparent black with a blur
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
      onClick={onClose} // Close on backdrop click
    >
      {/* Modal Container: High contrast, glowing border */}
      <div 
        className={`bg-gray-900/95 w-11/12 max-w-sm p-6 rounded-2xl shadow-2xl border border-${NEON_CYAN}/50 transition-all duration-300 transform scale-100 hover:shadow-[0_0_40px_rgba(0,255,255,0.3)]`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        onKeyDown={handleKeyDown}
        tabIndex={0} // Makes the div focusable for keydown events
      >
        
        {/* Title */}
        <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-3">
          <Edit className={`w-6 h-6 text-${NEON_FUCHSIA}`} />
          <h4 className={`text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-${NEON_FUCHSIA} tracking-wide`}>
            RENAME ITEM
          </h4>
        </div>
        
        {/* Current Name Display */}
        <p className="text-sm text-gray-400 mb-2">
            Current Name: <span className="text-gray-200 italic">{fileName}</span>
        </p>

        {/* Input Field: Sleek dark input with neon focus ring */}
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="Enter new name"
          // Responsive input padding
          className={`w-full px-4 py-3 mb-6 text-base rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-${NEON_CYAN} focus:border-${NEON_CYAN}`}
          autoFocus
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {/* Cancel Button: Standard dark button */}
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200"
          >
            CANCEL
          </button>
          
          {/* Save Button: Neon Green accent, disabled state added */}
          <button
            onClick={handleSave}
            disabled={!newFileName.trim() || newFileName === fileName}
            className={`px-5 py-2 text-sm font-bold rounded-lg ${
                (!newFileName.trim() || newFileName === fileName) 
                ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                : `bg-${NEON_GREEN} hover:bg-emerald-400 text-gray-900 shadow-lg shadow-${NEON_GREEN}/50 transition-all duration-300 transform hover:scale-[1.05]`
            }`}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};