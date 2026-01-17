import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileDetail, useUserProfile } from '@/features/user';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const {
        userData,
        editingField,
        tempValue,
        handleEditClick,
        handleSave,
        handleCancel,
        setTempValue
    } = useUserProfile();

    const handleClose = () => navigate("/");

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-20 p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                
                {/* Header Actions */}
                <div className="absolute top-4 right-4 z-10">
                    <button 
                        onClick={handleClose}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Close profile"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    <ProfileDetail
                        user={userData}
                        editingField={editingField}
                        onEdit={handleEditClick}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        tempValue={tempValue}
                        setTempValue={setTempValue}
                    />

                    <div className="mt-10 pt-8 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Account Actions</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                Change Password
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-gray-300 rounded hover:bg-red-50 hover:border-red-200 transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
