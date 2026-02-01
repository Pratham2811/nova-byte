import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { uploadAvatarApi } from "../services/user.service";

/**
 * ProfileAvatar - Avatar display with upload functionality
 */
export const ProfileAvatar = ({ user, onAvatarUpdate }) => {
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        setLoading(true);
        try {
            const response = await uploadAvatarApi(file);
            onAvatarUpdate(response.avatarUrl);
            toast.success("Avatar updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload avatar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-6">
            <div className="relative">
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                        {getInitials(user.name)}
                    </div>
                )}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="absolute -bottom-1 -right-1 p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    <Camera size={14} className="text-gray-600" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name || "User"}</h2>
                <p className="text-gray-500">{user.email}</p>
            </div>
        </div>
    );
};

export default ProfileAvatar;
