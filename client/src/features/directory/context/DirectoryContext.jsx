import React, { createContext, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDirectory } from '../hooks/useDirectory';
import { useFolderActions } from '../hooks/useFolderActions';
import { useModals } from '../hooks/useModals';
import { useFileActions } from '@/features/file/hooks/useFileActions';
import { VIEW_MODES } from '../constants/directory.constants.js';

const DirectoryContext = createContext();

/**
 * Hook to access Directory Context
 */
export const useDirectoryContext = () => {
  const context = useContext(DirectoryContext);
  if (!context) {
    throw new Error('useDirectoryContext must be used within a DirectoryProvider');
  }
  return context;
};

/**
 * DirectoryProvider - Provides directory data and actions to children
 */
export const DirectoryProvider = ({ children }) => {
  const { dirid } = useParams();
  const navigate = useNavigate();

  // View State
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(VIEW_MODES.LIST);

  // Data from useDirectory
  const { directories, files, loading, error, isEmpty, refresh } = useDirectory(dirid);

  // Folder actions (create, rename, delete)
  const folderActions = useFolderActions(refresh);

  // File actions (rename, delete, download)
  const fileActions = useFileActions(refresh);

  // Modal state
  const modalState = useModals();

  // Filtering (derived state)
  const filteredDirectories = searchQuery
    ? directories.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : directories;

  const filteredFiles = searchQuery
    ? files.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files;

  // Navigation
  const handleFolderClick = (folder) => {
    navigate(`/directory/${folder.id}`);
  };

  const value = {
    // Core Data
    currentDirectoryId: dirid,
    directories: filteredDirectories,
    files: filteredFiles,
    loading,
    error,
    isEmpty: isEmpty && !searchQuery,
    refresh,

    // View State
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,

    // Navigation
    handleFolderClick,

    // Folder Actions
    ...folderActions,

    // File Actions
    fileActions,

    // Modal State
    ...modalState,
  };

  return (
    <DirectoryContext.Provider value={value}>
      {children}
    </DirectoryContext.Provider>
  );
};
