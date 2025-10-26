import React from 'react';
import UserProfileField from './UserProfileField';

const UserProfileDetails = ({ user, editingField, onEdit, onSave, onCancel, tempValue, setTempValue }) => {
  const fields = [
    { label: 'Username', value: user.name, key: 'Username' },
    { label: 'Email Address', value: user.email, key: 'Email Address' },
  ];

  const readOnlyFields = [
    { label: 'Member Since', value: user.memberSince, key: 'Member Since' },
    { label: 'Storage Usage', value: user.storageUsed, key: 'Storage Usage' },
  ];

  return (
    <>
      {/* Avatar + Header */}
      <div className="flex items-center gap-6 mb-8 pb-6 border-b border-violet-600/50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-gray-900 ring-2 ring-cyan-400/80">
          {user.id}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{user.name}</h3>
          <p className="text-sm text-gray-400">Account Details</p>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="space-y-2">
        {fields.map(f => (
          <UserProfileField
            key={f.key}
            label={f.label}
            value={f.value}
            fieldKey={f.key}
            editingField={editingField}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
        ))}
      </div>

      {/* Read-Only Fields */}
      <div className="mt-8 pt-5 border-t border-gray-800 space-y-2">
        {readOnlyFields.map(f => (
          <UserProfileField
            key={f.key}
            label={f.label}
            value={f.value}
            fieldKey={f.key}
            editingField={editingField}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
        ))}
      </div>
    </>
  );
};

export default UserProfileDetails;
