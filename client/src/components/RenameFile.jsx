// RenamePopup.jsx
import React, { useState } from "react";

export const RenameFile = ({ fileName,onClose,OnRenameConfirm }) => {
  const [newFileName, setNewFileName] = useState(fileName);


 
 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-gray-800 w-64 p-4 rounded-lg shadow-lg border border-gray-700">
        <h4 className="text-sm font-medium text-gray-200 mb-2">
          Rename File
        </h4>
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="Enter new name"
          className="w-full px-2 py-1 mb-3 text-sm rounded-md bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm rounded-md bg-gray-700 hover:bg-gray-600 text-gray-200"
          >
            Cancel
          </button>
          <button
         
        
onClick={() => OnRenameConfirm(newFileName)}
            className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
