import React from 'react';
import { User, Mail, Calendar, Key, X, LogOut } from 'lucide-react'; // Import LogOut

// Define Theme Colors (matching HomePage for consistency)
const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-400";
const NEON_RED = "rose-500";
const ACTIVE_GRADIENT = `bg-gradient-to-r from-cyan-500 to-fuchsia-600`;

/**
 * Renders the user profile page content.
 * @param {object} props - Component props.
 * @param {function} props.onClose - Function to navigate back (e.g., to My Files).
 * @param {function} props.onLogout - Function to handle the logout action.
 */
export const ProfilePage = ({ onClose, onLogout }) => {
    // Mock User Data
    const user = {
        name: "Ares Digital",
        email: "ares@cyberdrive.com",
        memberSince: "2020-01-15",
        storageUsed: "1.2 GB / 10 GB",
        id: "AD"
    };

    const InfoRow = ({ icon: Icon, label, value, isSpecial = false }) => (
        <div className="flex justify-between items-center py-4 border-b border-gray-800 last:border-b-0">
            <div className="flex items-center gap-3">
                <Icon size={20} className={`text-${NEON_CYAN}`} />
                <span className="text-gray-400 font-light">{label}</span>
            </div>
            {isSpecial ? (
                <span className={`text-sm font-bold text-transparent bg-clip-text ${ACTIVE_GRADIENT}`}>
                    {value}
                </span>
            ) : (
                <span className="text-gray-200 font-medium">{value}</span>
            )}
        </div>
    );

    return (
        <div className="min-h-screen p-6 md:p-10 bg-gray-950 text-white font-sans">
            
            {/* Header with Close Button */}
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-fuchsia-600/50">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 tracking-wider">
                    User Profile
                </h2>
                <button 
                    onClick={onClose}
                    className={`p-2 rounded-full text-${NEON_CYAN} hover:bg-gray-800 transition-colors cursor-pointer`}
                    aria-label="Close profile and go back"
                >
                    <X size={24} />
                </button>
            </header>

            {/* Profile Card */}
            <div className="max-w-3xl mx-auto bg-gray-900/80 backdrop-blur-md p-6 rounded-xl shadow-2xl shadow-cyan-500/10 border border-cyan-600/30">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold border-4 ring-4 ring-fuchsia-500/30 ${ACTIVE_GRADIENT} text-white`}>
                        {user.id}
                    </div>
                    <h3 className="text-3xl font-bold mt-4 text-gray-100">{user.name}</h3>
                </div>

                {/* Info Grid */}
                <div className="space-y-2">
                    <InfoRow icon={User} label="Username" value={user.name} />
                    <InfoRow icon={Mail} label="Email Address" value={user.email} />
                    <InfoRow icon={Calendar} label="Member Since" value={user.memberSince} />
                    <InfoRow 
                        icon={Key} 
                        label="Storage Usage" 
                        value={user.storageUsed} 
                        isSpecial={true} 
                    />
                </div>

                {/* Actions and LOGOUT */}
                <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col gap-4">
                    <div className="flex justify-end gap-4">
                        <button className={`px-5 py-2 rounded-lg font-semibold text-gray-100 bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer border border-transparent hover:border-cyan-500`}>
                            Change Password
                        </button>
                        <button className={`px-5 py-2 rounded-lg font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer border border-transparent hover:border-rose-400`}>
                            Delete Account
                        </button>
                    </div>

                    {/* LOGOUT BUTTON at the end */}
                    <button
                        onClick={onLogout}
                        className={`mt-4 w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg font-bold text-white bg-gray-800 hover:bg-red-900/50 transition-colors duration-200 cursor-pointer border border-transparent hover:border-red-500/50`}
                    >
                        <LogOut size={20} className={`text-${NEON_RED}`} />
                        LOGOUT
                    </button>
                </div>

            </div>
        </div>
    );
};