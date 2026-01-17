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
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-normal text-gray-800">Personal Info</h2>
        <p className="text-gray-500 mt-2">Basic info, like your name and photo, that you use on Drive services</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
         {/* Title Row */}
         <div className="px-6 py-4 border-b border-gray-100">
             <h3 className="text-lg font-medium text-gray-800">Profile</h3>
             <p className="text-sm text-gray-500">Some info may be visible to other people using the service.</p>
         </div>

         {/* Avatar Row */}
         <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
             <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Photo</span>
             <div className="flex items-center gap-4">
                 <span className="text-sm text-gray-500 hidden group-hover:block">A photo helps people recognize you</span>
                 <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl">
                     {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                 </div>
             </div>
         </div>

        {/* Editable Fields */}
        <div>
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
        <div>
            {readOnlyFields.map(f => (
            <UserProfileField
                key={f.key}
                label={f.label}
                value={f.value}
                fieldKey={f.key}
                editingField={editingField}
                readOnly={true}
            />
            ))}
        </div>
      </div>
    </>
  );
};

export default UserProfileDetails;
