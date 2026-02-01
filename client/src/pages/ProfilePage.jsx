import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/auth/context/authContext";
import {
    ProfileAvatar,
    ProfileInfo,
    SecuritySection,
    PasswordChangeModal,
    AccountActions,
    DeleteAccountModal,
} from "@/features/user";

/**
 * ProfilePage - User profile management page
 */
export const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, updateUser, logout, loading } = useAuth();

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!user) {
        navigate("/login");
        return null;
    }

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleDeleteConfirm = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Profile Settings</h1>
                </div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-6">
                {/* Avatar */}
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                    <ProfileAvatar user={user} onAvatarUpdate={(url) => updateUser({ avatar: url })} />
                </section>

                {/* Info */}
                <ProfileInfo user={user} onUpdate={updateUser} />

                {/* Security */}
                <SecuritySection onOpenPasswordModal={() => setShowPasswordModal(true)} />

                {/* Actions */}
                <AccountActions onLogout={handleLogout} onOpenDeleteModal={() => setShowDeleteModal(true)} />
            </main>

            {/* Modals */}
            <PasswordChangeModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
            <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteConfirm} />
        </div>
    );
};

export default ProfilePage;
