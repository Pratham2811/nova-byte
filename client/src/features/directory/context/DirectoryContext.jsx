import React, { createContext, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDirectory, useDirectoryActions } from '../hooks';
import { Toast } from '@/shared/components';
import { VIEW_MODES } from '../constants/directory.constants.js';

const DirectoryContext = createContext();

/**
 * Hook to access Directory Context
 * @throws {Error} If used outside DirectoryProvider
 */
export const useDirectoryContext = () => {
  const context = useContext(DirectoryContext);
  if (!context) {
    throw new Error('useDirectoryContext must be used within a DirectoryProvider');
  }
  return context;
};


export const DirectoryProvider = ({ children }) => {
  const { dirid } = useParams();
  const navigate = useNavigate();
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // View State
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);

  // Data Fetching
  const {
    directoriesList,
    filesList,
    loading,
    error,
    isEmpty,
    fetchFiles,
  } = useDirectory(dirid);

  // Actions (modals, CRUD operations)
  const actions = useDirectoryActions(showToast, fetchFiles, dirid);

  // Derived State (filtering)
  const filteredFolders = searchQuery
    ? directoriesList.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : directoriesList;

  const filteredFiles = searchQuery
    ? filesList.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filesList;

  // Navigation Handlers
  const handleNavigate = (path) => {
    navigate(path ? `/directory/${path}` : '/');
  };

  const handleFolderClick = (folder) => {
    navigate(`/directory/${folder.id}`);
  };

  const value = {
    // Core State
    currentDirectoryId: dirid,
    directories: filteredFolders,
    files: filteredFiles,
    loading,
    error,
    isEmpty,
    
    // View State
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    
    // Navigation
    handleNavigate,
    handleFolderClick,
    
    // Refresh
    refresh: fetchFiles,
    
    // Toast
    showToast,
    
    // Action Hooks Data (Modals & Handlers from useDirectoryActions)
    ...actions,
  };

  return (
    <DirectoryContext.Provider value={value}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        isOpen={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </DirectoryContext.Provider>
  );
};
