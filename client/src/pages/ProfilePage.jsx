import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
   

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // if (loading) {
    //     return (
    //         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    //             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    //         </div>
    //     );
    // }

    // if (!user) {
    //     navigate("/login");
    //     return null;
    // }

    // const handleLogout = async () => {
    //     await logout();
    //     navigate("/login");
    // };

    // const handleDeleteConfirm = async () => {
    //     await logout();
    //     navigate("/login");
    // };

    return (
       <>
       </>
    )
};

export default ProfilePage;
