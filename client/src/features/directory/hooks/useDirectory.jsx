/**
 * useDirectory Hook
 * Fetches directory contents and manages loading/error state
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDirectoryContents } from "../services/folder.service";

export const useDirectory = (dirid) => {
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchDirectoryContents(dirid || "");
      // axios returns data directly, response structure: { data: { directories, files } }
      setDirectories(response.data?.directories || response.directories || []);
      setFiles(response.data?.files || response.files || []);
    } catch (err) {
      if (err.response?.status === 401 || err.status === 401) {
        navigate("/login");
        return;
      }
      setError(err.message || "Failed to load directory");
    } finally {
      setLoading(false);
    }
  }, [dirid, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isEmpty = directories.length === 0 && files.length === 0;

  return {
    directories,
    files,
    loading,
    error,
    isEmpty,
    refresh: fetchData,
  };
};

export { useDirectory as useFileManager };
