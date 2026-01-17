/**
 * File Service
 * Handles file operations (fetch, upload, rename, delete, download)
 */

import { get, patch, del, uploadFormData } from "@/shared/services/api.service";




/**
 * Upload files to a directory
 * @param {File[]} files - Array of files to upload
 * @param {string} parentDirId - Parent directory ID
 * @returns {Promise<Object>} - Upload response
 */
export const uploadFiles = async (files, parentDirId = "") => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append("uploadedFiles", file);
  });
  
  formData.append("parentDirId", parentDirId);
  
  return await uploadFormData("/file/upload", formData);
};

/**
 * Download a file
 * @param {string} fileId - File ID
 * @returns {string} - Download URL
 */
export const getDownloadUrl = (fileId) => {
  return `http://localhost:80/file/${fileId}?action=download`;
};

/**
 * Rename a file
 * @param {string} fileId - File ID
 * @param {string} oldName - Old file name
 * @param {string} newName - New file name
 * @returns {Promise<Object>} - Rename response
 */
export const renameFile = async (fileId, oldName, newName) => {
  return await patch(`/file/${fileId}`, { 
    oldFilename: oldName, 
    newFilename: newName 
  });
};

/**
 * Delete a file (move to trash)
 * @param {string} fileId - File ID
 * @returns {Promise<Object>} - Delete response
 */
export const 
deleteFile = async (fileId) => {
  return await del(`/file/${fileId}`);
};

export default {
  uploadFiles,
  getDownloadUrl,
  renameFile,
  deleteFile,
};
