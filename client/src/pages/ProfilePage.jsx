import React, { useEffect } from 'react';
import { X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserProfileDetails from '../components/ProfileDetail.jsx';

const NEON_CYAN = "cyan-400";
const NEON_RED = "rose-500";

const MOCK_USER = {
    name: "Ares Digital",
    email: "ares@cyberdrive.com",
    memberSince: "2020-01-15",
    storageUsed: "1.2 GB / 10 GB",
    id: "AD",
};

const PulseKeyframes = `
  @keyframes neon-pulse {
      0%, 100% { box-shadow: 0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(124, 58, 237, 0.3); } 
      50% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.8), 0 0 30px rgba(124, 58, 237, 0.5); }
  }
  .neon-pulse-shadow {
      animation: neon-pulse 3s infinite alternate;
  }
`;

export const ProfilePage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = React.useState({
        name:"",
        email:""
    });
    const [editingField, setEditingField] = React.useState(null);
    const [tempValue, setTempValue] = React.useState('');
      const FetchUserData = async () => {
        try {
          const url = "http://localhost:80/user";
          const response = await fetch(url, {
            method: "GET",
            credentials:"include"
          });
          const data = await response.json();
          console.log("Fetched user:", data);
          setUserData({name:data.username || "User",email:data.email||"abcd@123"});
    
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
    
      useEffect(() => {
        FetchUserData();
      }, []);

    const handleEditClick = (field, value) => {
        setEditingField(field);
        setTempValue(value);
    };
    const handleSave = (field) => {
        if (!tempValue.trim()) return;
        let newUserData = {...userData};
        if(field==='Username'){ newUserData.name = tempValue; newUserData.id = tempValue.substring(0,2).toUpperCase();}
        if(field==='Email Address'){ newUserData.email = tempValue;}
        setUserData(newUserData);
        setEditingField(null);
        setTempValue('');
    };
    const handleCancel = () => { setEditingField(null); setTempValue(''); };

    const handleClose = () => navigate("/");
    const handleLogout = () => console.log("User logged out.");

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gray-950 text-white font-sans relative">
            <style dangerouslySetInnerHTML={{ __html: PulseKeyframes }} />
            <header className="flex justify-between items-center mb-8 pb-3 border-b-2 border-violet-600/70">
                <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 tracking-wider">
                    USER ACCESS PORTAL
                </h2>
                <button 
                    onClick={handleClose}
                    className={`p-2 rounded-full text-${NEON_CYAN} hover:bg-gray-800 transition-colors cursor-pointer`}
                >
                    <X size={24} />
                </button>
            </header>

            <div className={`max-w-2xl mx-auto bg-gray-900/70 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl neon-pulse-shadow border border-cyan-500/50 ring-2 ring-violet-500/20`}>
                <UserProfileDetails
                    user={userData}
                    editingField={editingField}
                    onEdit={handleEditClick}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    tempValue={tempValue}
                    setTempValue={setTempValue}
                />

                <div className="mt-10 pt-5 border-t border-gray-800 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button className="flex-1 sm:flex-none px-5 py-2 rounded-lg font-semibold text-gray-100 bg-gray-700/50 hover:bg-gray-700 transition-colors cursor-pointer border border-transparent hover:border-cyan-500">
                            Change Password
                        </button>
                        <button className="flex-1 sm:flex-none px-5 py-2 rounded-lg font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer border border-transparent hover:border-rose-400 shadow-md shadow-rose-900/50">
                            Delete Account
                        </button>
                    </div>

                    <button className={`mt-4 w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg font-bold text-lg text-white transition-all duration-300 cursor-pointer border border-transparent bg-gray-800 hover:bg-violet-900/40 hover:border-violet-500/50 shadow-lg shadow-violet-900/50`}>
                        <LogOut size={22} className={`text-${NEON_RED}`} />
                        LOGOUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
