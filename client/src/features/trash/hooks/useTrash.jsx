/**
 * useTrash Hook
 * Manages trash bin operations (fetch, restore, permanent delete)
 */

import { useState, useEffect } from "react";
import { fetchTrashFiles, restoreFile, permanentlyDeleteFile } from "../services/trash.service";

export const useTrash = () => {
  const [trashFiles, setTrashFiles] = useState([]);
  const [trashDirectories, setTrashDirectories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [restoredFilename, setRestoredFilename] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const loadTrashFiles = async () => {
    try {
      setLoading(true);
      const response = await fetchTrashFiles();
      setTrashFiles(response.data.filesList || []);
      setTrashDirectories(response.data.directoriesList || []);
    } catch (err) {
      console.error("Failed to fetch trash files:", err);
      setError("Failed to load trash files. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrashFiles();
  }, []);

  const handleRestore = async (file) => {
    try {
      await restoreFile(file.id, file.name);
      setShowConfirm(false);
      loadTrashFiles();
    } catch (err) {
      console.error("Error restoring file:", err);
    }
  };

  const handlePermanentDelete = async (file) => {
    try {
      await permanentlyDeleteFile(file.id);
      setShowConfirmDelete(false);
      loadTrashFiles();
    } catch (err) {
      console.error("Error permanently deleting file:", err);
    }
  };

  return {
    trashFiles,
    trashDirectories,
    loading,
    error,
    showConfirm,
    restoredFilename,
    showConfirmDelete,
    handleRestore,
    handlePermanentDelete,
    setShowConfirm,
    setRestoredFilename,
    setShowConfirmDelete,
  };
};
