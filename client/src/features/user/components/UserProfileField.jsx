import React from 'react';
import { Edit } from 'lucide-react';

const UserProfileField = ({ label, value, fieldKey, editingField, onEdit, onSave, onCancel, tempValue, setTempValue, readOnly = false }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-100 last:border-b-0 px-6 hover:bg-gray-50 transition-colors group">
      <span className="text-sm font-medium text-gray-500 w-48 shrink-0">{label}</span>
      <div className="flex-1 w-full flex items-center justify-between mt-2 sm:mt-0">
        {editingField === fieldKey ? (
          <input
            type={fieldKey === 'Email Address' ? 'email' : 'text'}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none mr-4 text-gray-700 bg-white"
            autoFocus
          />
        ) : (
          <span className="text-sm text-gray-800 break-all">{value}</span>
        )}

        {!readOnly && ['Username', 'Email Address'].includes(fieldKey) && (
          <div className="ml-4 flex gap-2 shrink-0">
            {editingField === fieldKey ? (
              <>
                <button
                  onClick={() => onSave(fieldKey)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => onEdit(fieldKey, value)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
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
