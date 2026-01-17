/**
 * Folder Service
 * Handles folder operations (create, rename, delete)
 */

import { get, post, patch, del } from "@/shared/services/api.service";

/**
 * Fetch directory contents (files and folders)
 * @param {string} dirId - Directory ID (empty string for root)
 * @returns {Promise<Object>} - Directory contents with files and folders
 */
export const fetchDirectoryContents = async (dirId = "") => {
  return await get(`/directory/${dirId}`);
};

/**
 * Create a new folder
 * @param {string} name - Folder name
 * @param {string} parentId - Parent directory ID
 * @returns {Promise<Object>} - Created folder data
 */
export const createFolder = async (name, parentId = "") => {
  return await post("/directory/create", {
    directoryname: name,
    parentDirId: parentId,
  });
};

/**
 * Rename a folder
 * @param {string} folderId - Folder ID
 * @param {string} oldName - Old folder name
 * @param {string} newName - New folder name
 * @returns {Promise<Object>} - Rename response
 */
export const renameFolder = async (folderId, oldName, newName) => {
  return await patch(`/directory/${folderId}`, {
    oldName: oldName,
    newName: newName,
  });
};

/**
 * Delete a folder
 * @param {string} folderId - Folder ID
 * @returns {Promise<Object>} - Delete response
 */
export const deleteFolder = async (folderId) => {
  return await del(`/directory/${folderId}`);
};

export default {
  fetchDirectoryContents,
  createFolder,
  renameFolder,
  deleteFolder,
};
