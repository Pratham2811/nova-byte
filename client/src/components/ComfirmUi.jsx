import React from "react";

export const ConfirmPopup = ({ filename, onConfirm, onCancel ,headTitle,action}) => {

  console.log(filename);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay with Blur */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

      {/* Popup Box */}
      <div
        className="relative  bg-gray-900  backdrop-blur-xl 
                      p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm border border-white/20 
                      dark:border-gray-700/30"
      >
        {/* Title */}
        <h2 className="text-lg font-semibold text-white mb-3">{headTitle}</h2>

        {/* Message */}
        <p className="text-md text-gray-700 dark:text-gray-500 mb-6">
          Are you sure you want to restore:{" "}
          <span className="font-medium text-white dark:text-gray-100 ml-2">
            {filename.name}
          </span>
          
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border bg-gray-400 border-gray-300 dark:border-gray-700 cursor-pointer
                       text-gray-700 dark:text-gray-300 hover:bg-white crusor-pointer 
                       dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(filename)}
            className="px-4 py-2 rounded-xl bg-red-600 text-white cursor-pointer
                       hover:bg-red-700 shadow-sm transition "
          >
            {action}
          </button>
        </div>
      </div>
    </div>
  );
};
