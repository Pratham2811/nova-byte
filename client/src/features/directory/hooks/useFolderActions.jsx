/**
 * useFolderActions Hook
 * Handles folder CRUD operations (create, rename, delete)
 */

import { useState } from "react";
import { toast } from "sonner";
import { createFolder, renameFolder, deleteFolder } from "../services/folder.service";

export const useFolderActions = (onSuccess) => {
    const [loading, setLoading] = useState(false);

    const handleCreateFolder = async (name, parentId) => {
        setLoading(true);
        try {
            await createFolder(name, parentId);
            toast.success("Folder created");
            onSuccess?.();
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create folder");
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const handleRenameFolder = async (folderId, oldName, newName) => {
        setLoading(true);
        try {
            await renameFolder(folderId, oldName, newName);
            toast.success("Folder renamed");
            onSuccess?.();
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to rename folder");
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFolder = async (folderId) => {
        setLoading(true);
        try {
            await deleteFolder(folderId);
            toast.success("Folder moved to trash");
            onSuccess?.();
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete folder");
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createFolder: handleCreateFolder,
        renameFolder: handleRenameFolder,
        deleteFolder: handleDeleteFolder,
    };
};
