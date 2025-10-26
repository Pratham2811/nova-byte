import React from 'react';
import { Edit } from 'lucide-react';

const UserProfileField = ({ label, value, fieldKey, editingField, onEdit, onSave, onCancel, tempValue, setTempValue }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-800 last:border-b-0">
      <span className="text-gray-400 text-sm font-medium w-32 shrink-0">{label}</span>
      <div className="flex-1 w-full flex items-center justify-between mt-1 sm:mt-0">
        {editingField === fieldKey ? (
          <input
            type={fieldKey === 'Email Address' ? 'email' : 'text'}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="bg-gray-700/50 p-2 rounded-md text-white border border-cyan-500/50 w-full mr-2 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        ) : (
          <span className="text-white text-md break-all">{value}</span>
        )}

        {['Username', 'Email Address'].includes(fieldKey) && (
          <div className="ml-4 flex gap-2 shrink-0">
            {editingField === fieldKey ? (
              <>
                <button
                  onClick={() => onSave(fieldKey)}
                  className="px-3 py-1 text-xs font-bold text-black bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="px-3 py-1 text-xs font-bold text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => onEdit(fieldKey, value)}
                className="p-1 rounded-full text-cyan-400 hover:bg-cyan-900/50 transition-colors"
                aria-label={`Edit ${fieldKey}`}
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileField;
