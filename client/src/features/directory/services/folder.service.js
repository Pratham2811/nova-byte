/**
 * Folder Service
 * Handles folder CRUD operations
 */

import api from "@/shared/services/axios";


/**
 * Create a new folder
 */
export const createFolder = async (name, parentId = "") => {
  const { data } = await api.post("/directory/create", {
    directoryname: name,
    parentDirId: parentId,
  });
  return data;
};

/**
 * Rename a folder
 */
export const renameFolder = async (folderId, oldName, newName) => {
  const { data } = await api.patch(`/directory/${folderId}`, {
    oldName: oldName,
    newName: newName,
  });
  return data;
};

/**
 * Delete a folder (moves to trash)
 */
export const deleteFolder = async (folderId) => {
  const { data } = await api.delete(`/directory/${folderId}`);
  return data;
};

/**
 * Fetch directory contents
 */
export const fetchDirectoryContents = async (dirId = "") => {
  const { data } = await api.get(`/directory/${dirId}`);
  return data;
};
