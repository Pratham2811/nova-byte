import React from 'react';
import { User, Mail, Calendar, Key, X, Edit, Check } from 'lucide-react';

// --- Styling Constants (Repeated for component self-sufficiency, but ideally imported from a theme file) ---
const NEON_CYAN = "cyan-400";
const NEON_VIOLET = "violet-400";
const ACTIVE_GRADIENT = `bg-gradient-to-r from-cyan-500 to-violet-600`; 
// ----------------------------------------------------------------------------------------------------------

/**
 * Helper component for displaying a single row of information, now supports editing.
 */
const InfoRow = ({ icon: Icon, label, value, isSpecial = false, editingField, onEdit, onSave, onCancel, tempValue, setTempValue }) => {
    const isEditing = editingField === label;
    
    // Only allow editing for Name and Email
    const isEditable = !isSpecial && (label === 'Username' || label === 'Email Address');

    // Conditional classes for edit mode visual clarity
    const rowClasses = `flex justify-between items-center px-4 py-3 md:py-4 border-b border-gray-800 last:border-b-0 transition-all duration-300 ${isEditing ? 'bg-gray-800/50 rounded-lg -mx-4' : ''}`;

    // Display for the value or the input field
    let ValueDisplay;
    if (isEditing) {
        ValueDisplay = (
            <input
                type={label === 'Email Address' ? 'email' : 'text'}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="bg-gray-700/80 text-white text-base rounded-md px-2 py-1.5 w-full max-w-[200px] text-right font-medium focus:ring-2 focus:ring-cyan-500 border border-transparent outline-none transition-all duration-200"
                onKeyDown={(e) => { if (e.key === 'Enter') onSave(label); }}
            />
        );
    } else {
        ValueDisplay = isSpecial ? (
            <span className={`text-base font-extrabold text-transparent bg-clip-text ${ACTIVE_GRADIENT}`}>
                {value}
            </span>
        ) : (
            <span className="text-gray-200 font-normal text-right text-base">{value}</span>
        );
    }
    
    // Action buttons (Edit or Save/Cancel)
    let ActionButton;
    if (isEditing) {
        ActionButton = (
            <div className="flex gap-2">
                <button
                    onClick={() => onSave(label)}
                    className="p-2 rounded-full text-white bg-green-600 hover:bg-green-500 transition-colors shadow-lg shadow-green-900/50"
                    aria-label="Save changes"
                    title="Save"
                >
                    <Check size={18} />
                </button>
                <button
                    onClick={onCancel}
                    className="p-2 rounded-full text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-lg shadow-rose-900/50"
                    aria-label="Cancel editing"
                    title="Cancel"
                >
                    <X size={18} />
                </button>
            </div>
        );
    } else if (isEditable) {
        ActionButton = (
            <button
                onClick={() => onEdit(label, value)}
                className={`p-2 rounded-full text-gray-500 hover:text-${NEON_VIOLET} hover:bg-gray-800 transition-colors duration-200`}
                aria-label={`Edit ${label}`}
                title={`Edit ${label}`}
            >
                <Edit size={18} />
            </button>
        );
    }

    return (
        <div className={rowClasses}>
            <div className="flex items-center gap-4">
                <Icon size={22} className={`text-${NEON_CYAN} flex-shrink-0`} />
                <span className="text-gray-400 font-light text-base tracking-wide">{label}</span>
            </div>
            
            <div className="flex items-center gap-4">
                {ValueDisplay}
                {ActionButton}
            </div>
        </div>
    );
};

export default InfoRow;
