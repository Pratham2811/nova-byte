/**
 * Trash Service
 * Handles trash/recycle bin operations
 */

import { get, patch, del } from "@/shared/services/api.service.js";

/**
 * Fetch all files in trash
 * @returns {Promise<Object>} - Trash files and directories
 */
export const fetchTrashFiles = async () => {
  return await get("/trash");
};

/**
 * Restore a file from trash
 * @param {string} fileId - File ID to restore
 * @param {string} filename - Filename to restore
 * @returns {Promise<Object>} - Restore response
 */
export const restoreFile = async (fileId, filename) => {
  return await patch(`/trash/restore-file/${fileId}`, {
    FilenametoRestore: filename,
  });
};

/**
 * Permanently delete a file from trash
 * @param {string} fileId - File ID to permanently delete
 * @returns {Promise<Object>} - Delete response
 */
export const permanentlyDeleteFile = async (fileId) => {
  return await del(`/trash/delete-permanent/${fileId}`);
};

export default {
  fetchTrashFiles,
  restoreFile,
  permanentlyDeleteFile,
};
