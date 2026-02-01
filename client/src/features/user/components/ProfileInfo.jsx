import { useState } from "react";
import { User, Mail, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { updateProfileApi } from "../services/user.service";

/**
 * ProfileInfo - Editable name and email fields
 */
export const ProfileInfo = ({ user, onUpdate }) => {
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEditStart = (field, value) => {
        setEditingField(field);
        setTempValue(value || "");
    };

    const handleSave = async () => {
        if (!tempValue.trim()) {
            toast.error("Field cannot be empty");
            return;
        }

        setLoading(true);
        try {
            const updates = editingField === "name"
                ? { name: tempValue, email: user.email }
                : { name: user.name, email: tempValue };

            await updateProfileApi(updates);
            onUpdate(updates);
            toast.success(`${editingField === "name" ? "Name" : "Email"} updated`);
            setEditingField(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditingField(null);
        setTempValue("");
    };

    const renderField = (field, icon, label, value) => (
        <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {icon}
                <div>
                    <p className="text-xs text-gray-500 uppercase">{label}</p>
                    {editingField === field ? (
                        <input
                            type={field === "email" ? "email" : "text"}
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="text-sm font-medium text-gray-900 border-b border-blue-500 outline-none bg-transparent py-1"
                            autoFocus
                        />
                    ) : (
                        <p className="text-sm font-medium text-gray-900">{value || "Not set"}</p>
                    )}
                </div>
            </div>
            {editingField === field ? (
                <div className="flex gap-2">
                    <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={16} className="text-gray-500" />
                    </button>
                    <button onClick={handleSave} disabled={loading} className="p-2 hover:bg-green-50 rounded-lg disabled:opacity-50">
                        <Check size={16} className="text-green-600" />
                    </button>
                </div>
            ) : (
                <button onClick={() => handleEditStart(field, value)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Pencil size={16} className="text-gray-500" />
                </button>
            )}
        </div>
    );

    return (
        <section className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            <h3 className="px-6 py-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                Account Information
            </h3>
            {renderField("name", <User size={18} className="text-gray-400" />, "Name", user.name)}
            {renderField("email", <Mail size={18} className="text-gray-400" />, "Email", user.email)}
        </section>
    );
};

export default ProfileInfo;
