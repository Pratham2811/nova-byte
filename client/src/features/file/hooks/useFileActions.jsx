/**
 * useFileActions Hook
 * Manages file and folder actions (rename, delete, open, download)
 */

import { useState } from "react";
import { getDownloadUrl, deleteFile, renameFile } from "../services/file.service";
import { deleteFolder, renameFolder } from "../../directory/services/folder.service";

export const useFileActions = (fetchFiles) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [oldFilename, setOldFilename] = useState(null);
  const [showRenameComp, setShowRenameComp] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Folder actions
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showFolderRename, setShowFolderRename] = useState(false);
  const [showFolderDelete, setShowFolderDelete] = useState(false);

  const handleOpenFile = (file) => {
    setSelectedFile(file);
  };

  const handleCloseViewer = () => {
    setSelectedFile(null);
  };

  const handleDownloadFile = (file) => {
    window.location.href = getDownloadUrl(file.id);
  };

  const handleDeleteFile = async (file) => {
    try {
      await deleteFile(file.id);
      setShowDeletePopup(false);
      if (fetchFiles) fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleRenameFile = async (fileId, oldName, newName) => {
    try {
      await renameFile(fileId, oldName, newName);
      setShowRenameComp(false);
      if (fetchFiles) fetchFiles();
    } catch (err) {
      console.error("Error renaming file:", err);
    }
  };

  const handleDeleteFolder = async (folder) => {
    try {
      await deleteFolder(folder.id);
      setShowFolderDelete(false);
      if (fetchFiles) fetchFiles();
    } catch (err) {
      console.error("Error deleting folder:", err);
    }
  };

  const handleRenameFolder = async (folderId, oldName, newName) => {
    try {
      await renameFolder(folderId, oldName, newName);
      setShowFolderRename(false);
      if (fetchFiles) fetchFiles();
    } catch (err) {
      console.error("Error renaming folder:", err);
    }
  };

  return {
    // File state
    selectedFile,
    oldFilename,
    showRenameComp,
    showDeletePopup,
    
    // Folder state
    selectedFolder,
    showFolderRename,
    showFolderDelete,

    // File actions
    handleOpenFile,
    handleCloseViewer,
    handleDownloadFile,
    handleDeleteFile,
    handleRenameFile,

    // Folder actions
    handleDeleteFolder,
    handleRenameFolder,

    // State setters
    setSelectedFile,
    setOldFilename,
    setShowRenameComp,
    setShowDeletePopup,
    setSelectedFolder,
    setShowFolderRename,
    setShowFolderDelete,
  };
};
