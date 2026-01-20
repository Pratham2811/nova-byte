import React, { createContext, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDirectory, useDirectoryActions } from '../hooks';
import { Toast } from '@/shared/components';

const DirectoryContext = createContext();

export const useDirectoryContext = () => {
  const context = useContext(DirectoryContext);
  if (!context) {
    throw new Error('useDirectoryContext must be used within a DirectoryProvider');
  }
  return context;
};

export const DirectoryProvider = ({ children }) => {
  const { dirid } = useParams();
  
  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Data Fetching
  const {
    directoriesList,
    filesList,
    loading,
    error,
    isEmpty,
    fetchFiles,
  } = useDirectory(dirid);

  // Actions
  const actions = useDirectoryActions(showToast, fetchFiles, dirid);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // Default view mode

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

  const value = {
    // State
    currentDirectoryId: dirid,
    directories: filteredFolders,
    files: filteredFiles,
    loading,
    error,
    isEmpty,
    searchQuery,
    viewMode,
    
    // Actions & Setters
    setSearchQuery,
    setViewMode,
    refresh: fetchFiles,
    
    // Action Hooks Data (Modals & Handlers)
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
