import React from 'react';

/**
 * Reusable button component for profile actions, styled with the neon gradient.
 */
const ActionButton = ({ text, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm tracking-wider uppercase 
               bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white 
               transition-all duration-300 transform hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
  >
    {text}
  </button>
);

// We need to export this component for use in ProfilePage
export default ActionButton;
