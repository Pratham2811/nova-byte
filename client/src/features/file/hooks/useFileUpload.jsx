/**
 * useUpload Hook
 * Manages file upload operations with progress tracking
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFiles } from "../services/file.service";

export const useUpload = (path, onClose, fetchFiles) => {
  const [uploadFilesList, setUploadFilesList] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusType, setStatusType] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setUploadFilesList(files);
      setUploadStatus(`${files.length} FILE(S) QUEUED`);
      setStatusType("info");
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (uploadFilesList.length === 0) {
      setUploadStatus("ERROR: NO DATA DETECTED");
      setStatusType("error");
      return;
    }

    try {
      setProgress(0);
      setUploadStatus("INITIALIZING UPLINK...");
      setStatusType("loading");

      // Simulate progress for visual feedback
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + 10;
        });
      }, 150);

      await uploadFiles(uploadFilesList, path);

      clearInterval(progressInterval);

      setUploadStatus("TRANSFER COMPLETE. DATA VERIFIED.");
      setStatusType("success");
      setProgress(100);
      setUploadFilesList([]);

      // Refresh parent directory and close after delay
      if (fetchFiles) fetchFiles();
      setTimeout(() => {
        if (onClose) onClose();
      }, 1500);
    } catch (err) {
      setUploadStatus(`UPLOAD FAILED: ${err.message || "SERVER ERROR"}`);
      setStatusType("error");
      setProgress(0);
      
      if (err.status === 401) {
        setTimeout(() => navigate("/login"), 3000);
      }
    }
  };

  const handleCancelFile = (index) => {
    const updatedFiles = uploadFilesList.filter((_, i) => i !== index);
    setUploadFilesList(updatedFiles);
    if (updatedFiles.length === 0) {
      setUploadStatus("");
      setProgress(0);
      setStatusType("");
    }
  };

  return {
    uploadFilesList,
    uploadStatus,
    progress,
    statusType,
    handleChange,
    handleUpload,
    handleCancelFile,
  };
};
