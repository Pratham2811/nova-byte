import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, Trash2, Menu, X, User } from 'lucide-react';
import { DirectoryView } from '@/features/directory';
import { TrashFiles } from '@/features/trash';
import { useSidebar } from '@/shared/hooks';

/**
 * HomePage Component
 * Main application page with sidebar navigation and content area
 */
export const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('files');
  const { isSidebarOpen, isMobile, setIsSidebarOpen } = useSidebar();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'files':
        return <DirectoryView />;
      case 'trash':
        return <TrashFiles />;
      default:
        return <DirectoryView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-white border-r border-gray-200 flex flex-col
          fixed md:static inset-y-0 left-0 z-50
          transform transition-transform duration-300
          ${isSidebarOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">CloudDrive</h1>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-600" />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">File Management System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => handleTabChange('files')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-colors duration-150 text-sm font-medium
              ${activeTab === 'files'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <Folder size={20} />
            <span>My Files</span>
          </button>

          <button
            onClick={() => handleTabChange('trash')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-colors duration-150 text-sm font-medium
              ${activeTab === 'trash'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <Trash2 size={20} />
            <span>Trash</span>
          </button>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/user-profile')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">My Account</p>
              <p className="text-xs text-gray-500">View profile</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar (Mobile) */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {activeTab === 'files' ? 'My Files' : 'Trash'}
          </h2>
        </div>

        {/* Content Area */}
        {renderContent()}
      </main>
    </div>
  );
};

export default HomePage;