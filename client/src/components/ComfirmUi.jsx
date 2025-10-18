import React from "react";
import { AlertTriangle, CornerUpLeft, Trash2 } from "lucide-react";

// Define Theme Colors/Styles
const NEON_CYAN = "cyan-400";
const NEON_RED = "rose-500"; 
const NEON_GREEN = "emerald-400"; 
const BG_MODAL = "bg-gray-900/95";
const BORDER_DARK = "border-gray-700/50";
const ACCENT_GRADIENT = `bg-gradient-to-r from-cyan-500 to-fuchsia-600`;
const TRASH_GRADIENT = `bg-gradient-to-r from-rose-500 to-fuchsia-500`; 

export const ConfirmPopup = ({ filename, onConfirm, onCancel, headTitle, action }) => {

  const isDeleteAction = action.toLowerCase() === "delete";
  
  // Choose icon and button color based on action type
  const ActionIcon = isDeleteAction ? Trash2 : CornerUpLeft;
  const iconColor = isDeleteAction ? `text-${NEON_RED}` : `text-${NEON_GREEN}`;
  
  // FIX: Use explicit Tailwind class strings for background and hover colors 
  // to ensure they are included in the final CSS bundle, and FORCE text-white.
  let actionButtonClasses;

  if (isDeleteAction) {
    actionButtonClasses = 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/40 text-white';
  } else {
    actionButtonClasses = 'bg-emerald-400 hover:bg-emerald-500 shadow-emerald-400/40 text-white';
  }
  
  // Set the gradient based on the action type
  const titleGradient = isDeleteAction ? TRASH_GRADIENT : ACCENT_GRADIENT;

  // The confirmation message content changes based on the action
  const messageText = isDeleteAction
    ? "This action is permanent and cannot be undone."
    : "This will move the item back to its original location.";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300">
      {/* Background Overlay with Blur */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/70" onClick={onCancel} />

      {/* Popup Box: High contrast, neon border */}
      <div
        className={`relative ${BG_MODAL} p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm border ${BORDER_DARK} 
                    transform transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]`}
      >
        
        {/* Header and Icon */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
          <ActionIcon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
          <h2 className="text-xl font-extrabold text-transparent bg-clip-text" style={{ backgroundImage: titleGradient }}>
            {headTitle.toUpperCase()}
          </h2>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">
            Are you sure you want to {action.toLowerCase()}:
          </p>
          {/* Filename with Highlight */}
          <p className={`text-md font-bold text-white p-2 rounded-lg border border-${NEON_CYAN}/50 bg-gray-800/60 break-words`}>
            {filename}
          </p>
          
          {/* Warning/Context Text */}
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${isDeleteAction ? 'bg-rose-900/40 border border-rose-500/50' : 'bg-emerald-900/40 border border-emerald-500/50'}`}>
            <AlertTriangle className={`w-4 h-4 ${isDeleteAction ? 'text-rose-400' : 'text-emerald-400'} flex-shrink-0`} />
            <p className={`text-xs ${isDeleteAction ? 'text-rose-200' : 'text-emerald-200'}`}>
              {messageText}
            </p>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {/* Cancel Button: Standard dark button */}
          <button
            onClick={onCancel}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors duration-200"
          >
            CANCEL
          </button>

          {/* Confirm Button: Neon Colored (FIXED VISIBILITY) */}
          <button
            onClick={() => onConfirm(filename)}
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.05] shadow-lg ${actionButtonClasses}`}
          >
            {action.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};