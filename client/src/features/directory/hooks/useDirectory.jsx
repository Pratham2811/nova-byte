/**
 * useFileManager Hook
 * Manages directory navigation and file/folder listing
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDirectoryContents } from "../services/folder.service";

export const useFileManager = (dirid) => {
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchFiles = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetchDirectoryContents(dirid || "");
      setDirectoriesList(response.data.directories || []);
      setFilesList(response.data.files || []);

    } catch (err) {
      
      
      if (err.status === 401) {
        navigate("/login");
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [dirid]);

  const handleGoBack = () => {
    if (!dirid) return;
    const parts = dirid.split("/");
    parts.pop();
    const newPath = parts.join("/");
    navigate(newPath ? "/directory/" + newPath : "/directory/");
  };

  const handleFolderClick = (id) => {
    navigate(`/directory/${id}`);
  };

  const isEmpty = directoriesList.length === 0 && filesList.length === 0;

  return {
    directoriesList,
    filesList,
    loading,
    error,
    isEmpty,
    fetchFiles,
    handleGoBack,
    handleFolderClick,
  };
};
