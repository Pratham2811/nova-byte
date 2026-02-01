/**
 * File Service
 * Handles file operations (upload, rename, delete, download)
 */

import axiosInstance from "@/shared/services/axios";

/**
 * Upload files to a directory
 */
export const uploadFiles = async (files, parentDirId = "") => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("uploadedFiles", file);
  });
  formData.append("parentDirId", parentDirId);

  const { data } = await axiosInstance.post("file/upload", formData);
  return data;
};

/**
 * Download a file
 */
export const getDownloadUrl = (fileId) => {
  return `http://localhost:80/file/${fileId}?action=download`;
};

/**
 * Rename a file
 */
export const renameFile = async (fileId, oldName, newName) => {
  const { data } = await axiosInstance.patch(`/file/${fileId}`, {
    oldFilename: oldName,
    newFilename: newName,
  });
  return data;
};

/**
 * Delete a file (move to trash)
 */
export const deleteFile = async (fileId) => {
  const { data } = await axiosInstance.delete(`/file/${fileId}`);
  return data;
};
