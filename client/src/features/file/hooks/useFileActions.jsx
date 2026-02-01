/**
 * useFileActions Hook
 * Handles file-specific actions (rename, delete, download)
 */

import { useState } from "react";
import { toast } from "sonner";
import { renameFile, deleteFile, getDownloadUrl } from "../services/file.service";

export const useFileActions = (onSuccess) => {
  const [loading, setLoading] = useState(false);

  const handleRenameFile = async (fileId, oldName, newName) => {
    setLoading(true);
    try {
      await renameFile(fileId, oldName, newName);
      toast.success("File renamed");
      onSuccess?.();
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to rename file");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    setLoading(true);
    try {
      await deleteFile(fileId);
      toast.success("File moved to trash");
      onSuccess?.();
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete file");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = (file) => {
    const url = getDownloadUrl(file.id);
    window.open(url, "_blank");
  };

  return {
    loading,
    renameFile: handleRenameFile,
    deleteFile: handleDeleteFile,
    downloadFile: handleDownloadFile,
  };
};
