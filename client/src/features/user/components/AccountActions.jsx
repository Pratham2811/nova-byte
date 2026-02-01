import { useState } from "react";
import { Trash2, LogOut, X } from "lucide-react";
import { toast } from "sonner";
import { deleteAccountApi } from "../services/user.service";

/**
 * DeleteAccountModal - Modal for account deletion with confirmation
 */
export const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
    const [confirmText, setConfirmText] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        if (confirmText !== "DELETE") {
            toast.error('Type "DELETE" to confirm');
            return;
        }

        setLoading(true);
        try {
            await deleteAccountApi();
            toast.success("Account deleted");
            onConfirm();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-red-600">Delete Account</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>

                <p className="text-sm text-gray-600">
                    This is <strong>permanent</strong>. All your data will be deleted.
                </p>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type <span className="font-mono text-red-600">DELETE</span> to confirm
                    </label>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="DELETE"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading || confirmText !== "DELETE"}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * AccountActions - Logout and delete account buttons
 */
export const AccountActions = ({ onLogout, onOpenDeleteModal }) => (
    <section className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <h3 className="px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wide">Account</h3>
        <button onClick={onLogout} className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50">
            <LogOut size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-900">Sign Out</span>
        </button>
        <button onClick={onOpenDeleteModal} className="w-full px-6 py-4 flex items-center gap-3 hover:bg-red-50">
            <Trash2 size={18} className="text-red-500" />
            <span className="text-sm font-medium text-red-600">Delete Account</span>
        </button>
    </section>
);

export default DeleteAccountModal;
