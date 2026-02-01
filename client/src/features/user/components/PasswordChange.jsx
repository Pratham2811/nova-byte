import { useState } from "react";
import { Lock, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { updatePasswordApi } from "../services/user.service";

/**
 * PasswordChangeModal - Modal for changing password
 */
export const PasswordChangeModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    if (!isOpen) return null;

    const handleSubmit = async () => {
        const { currentPassword, newPassword, confirmPassword } = data;

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await updatePasswordApi({ currentPassword, newPassword });
            toast.success("Password updated");
            onClose();
            setData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field === "currentPassword" ? "Current Password" : field === "newPassword" ? "New Password" : "Confirm Password"}
                            </label>
                            <input
                                type="password"
                                value={data[field]}
                                onChange={(e) => setData((prev) => ({ ...prev, [field]: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 pt-2">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * SecuritySection - Password change button
 */
export const SecuritySection = ({ onOpenPasswordModal }) => (
    <section className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <h3 className="px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wide">Security</h3>
        <button onClick={onOpenPasswordModal} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3">
                <Lock size={18} className="text-gray-400" />
                <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Change Password</p>
                    <p className="text-xs text-gray-500">Update your password</p>
                </div>
            </div>
            <Pencil size={16} className="text-gray-400" />
        </button>
    </section>
);

export default PasswordChangeModal;
