import React, { useState, useEffect } from "react";
import {
  Download,
  ExternalLink,
  Folder,
  FileText,
  Edit,
  Trash,
  Upload,
  ArrowLeft,
} from "lucide-react"; // Using ArrowLeft from lucide for consistency
import { useShowPopup } from "@/hooks/useShowPopup";
import { RenameFile } from "@/components/RenameFile";
import { ConfirmPopup } from "./ComfirmUi";
import { useNavigate, useParams } from "react-router-dom";
import CreateFolder from "./CreateFolder";
import { UploadForm } from "./UploadForm";
import { IoIosArrowBack } from "react-icons/io";

// Define accent colors for a consistent theme
const NEON_CYAN = "text-cyan-400";
const NEON_FUCHSIA = "text-fuchsia-400";
const NEON_TEAL = "text-teal-400";
const NEON_RED = "text-rose-500";
const BG_DARK = "bg-gray-950";
const ITEM_BG = "bg-gray-800/60";
const BORDER = "border-gray-700/50";

export const FileList = () => {
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showPopup, popupMessage, show } = useShowPopup();
  const [oldFilename, setOldFilename] = useState(null);
  const [showRenameComp, setShowRenameComp] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // For folder actions
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showFolderRename, setShowFolderRename] = useState(false);
  const [showFolderDelete, setShowFolderDelete] = useState(false);

  let { dirid } = useParams();
  const navigate = useNavigate();
  // console.log(directoriesList); // Cleaned up console logs
  // console.log(filesList); // Cleaned up console logs


  const fetchFiles = async () => {
    setLoading(true);
    setError("");
    try {
      // Added a small delay to showcase the loading state
      // await new Promise(resolve => setTimeout(resolve, 500)); 
      
      const response = await fetch(`http://localhost:80/directory/${dirid || ""}`,{
        credentials:"include"
      });
      if (!response.ok){
        if(response.status===401){
           
          setTimeout(()=>{
            navigate("/login")
          },2000)
        }
         
        
      } 
      const data = await response.json();
      setDirectoriesList(data.directories || []);
      setFilesList(data.files || []);
    
    } catch (err) {
      
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [dirid]);

  // Go back one directory in path
  const handleGoBack = () => {
    if (!dirid) return;
    const parts = dirid.split("/");
    parts.pop();
    const newPath = parts.join("/");
    navigate(newPath ? "/directory/" + newPath : "/directory/");
  };

  const handleFolderClick = (folderId) => {
    console.log("Navigating");
    navigate(`/directory/${folderId}`);
  };

  const handleOpenFile = (file) => {
    const url = `http://localhost:80/file/${file.id}?action=open`;
    window.open(url, "_blank");
  };

  const handleDownloadFile = (file) => {
    const url = `http://localhost:80/file/${file.id}?action=download`;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    show(`Starting download for ${file.name} 📥`);
  };

  const handleDeleteFile = async (file) => {
    const url = `http://localhost:80/file/${file.id}`;
    try {
      const res = await fetch(url, { method: "DELETE" ,credentials:"include"});
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      setShowDeletePopup(false);
      show(`${file.name} ${data?.message || 'deleted successfully'} ✅`);
      fetchFiles();
    } catch (error) {
      setError("Error deleting file:",error);
      show(`Failed to delete ${file.name} ❌`);
    }
  };

  const handleFileSave = async (newFilename) => {
    const url = `http://localhost:80/file/rename/${oldFilename.id}`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ oldFilename: oldFilename.name, newFilename }),
        credentials:"include"
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      await response.text();
      show(`Renamed file to ${newFilename} ✅`);
      fetchFiles();
    } catch (error) {
      setError("Error renaming file:",error);
      show(`Failed to rename file ❌`);
    }
    setShowRenameComp(false);
  };

  // --- Folder rename logic ---
  const handleFolderRename = async (newName) => {
    const url = `http://localhost:80/directory/rename/${selectedFolder.id}`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ oldName: selectedFolder.name, newName }),
        credentials:"include"
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      await response.text();
      fetchFiles();
      show(`Renamed folder to ${newName} ✅`);
    } catch (error) {
      setError("Error renaming folder:",error);
      show(`Failed to rename folder ❌`);
    }
    setShowFolderRename(false);
  };

  // --- Folder delete logic ---
  const handleDeleteFolder = async (folder) => {
    const url = `http://localhost:80/directory/${folder.id}`;
    try {
      const res = await fetch(url, { method: "DELETE" ,credentials:"include"});
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      setShowFolderDelete(false);
      show(`${folder.name} ${data?.message || 'deleted successfully'} ✅`);
      fetchFiles();
    } catch (error) {
      setError("Error deleting folder:",error);
      show(`Failed to delete folder ❌`);
    }
  };

  // Empty state checks
  const isEmpty =
    directoriesList.length === 0 && filesList.length === 0;

  return (
    // 1. Vibrant Background and Global Styling
    <div className={`p-4 sm:p-6 md:p-8 flex-1 flex flex-col ${BG_DARK} text-gray-100 min-h-screen`}>
      
      {/* HEADER: Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-fuchsia-400/30 pb-4">
        
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          {dirid && (
            <button
              onClick={handleGoBack}
              className={`p-2 rounded-full ${ITEM_BG} ${BORDER} text-gray-300 hover:bg-gray-700/80 transition-all duration-200 shadow-md hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]`}
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 className="font-extrabold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 whitespace-nowrap overflow-hidden text-ellipsis max-w-[calc(100vw-150px)]">
            /{dirid || "Root Directory"}
          </h1>
        </div>
        
        {/* Right: Actions */}
        <div className="flex gap-4 items-center">
          <CreateFolder directoryPath={dirid} fetchFiles={fetchFiles} />
          <button 
            onClick={() => setShowUpload(true)}
            className={`p-2 rounded-full ${NEON_CYAN} ${ITEM_BG} ${BORDER} hover:bg-gray-700/80 transition-all duration-200 shadow-md hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]`}
            aria-label="Upload File"
          >
            <Upload size={20} />
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {loading && (
        <div className={`text-center ${NEON_CYAN} py-10 text-lg animate-pulse`}>
          <p>Loading directory contents...</p>
        </div>
      )}
      {error && (
        <div className="text-center bg-rose-900/40 text-rose-400 p-4 rounded-lg my-4">
          <p className="font-bold">SYSTEM ERROR:</p>
          <p>{error}</p>
        </div>
      )}
      {!loading && isEmpty && (
        <div className="text-center text-gray-400 py-10 text-lg">
          <Folder size={30} className="mx-auto mb-3" />
          <p>This folder is empty. Get started by creating a folder or uploading a file!</p>
        </div>
      )}

      {/* File/Folder List */}
      <div className="space-y-3 flex-1">
        
        {/* Render Folders First */}
        <div className="space-y-3">
          {directoriesList.map((folder) => (
            <div
              key={folder.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${ITEM_BG} backdrop-blur-sm rounded-xl ${BORDER} shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:border-teal-400/50`}
            >
              <div 
                className="flex items-center gap-4 mb-3 sm:mb-0 cursor-pointer flex-grow"
                onClick={() => handleFolderClick(folder.id)}
              >
                <Folder className={`${NEON_TEAL} w-6 h-6 flex-shrink-0`} />
                <span className="font-semibold text-lg text-gray-200 truncate">{folder.name}</span>
              </div>
              <div className="flex gap-3 justify-end sm:justify-start">
                {/* Folder Actions */}
                {/* Trash Button - Neon Red */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent folder click navigation
                    setShowFolderDelete(true);
                    setSelectedFolder(folder);
                  }}
                  className={`p-2 rounded-lg border ${BORDER} hover:border-rose-500 transition-colors duration-200`}
                  aria-label={`Delete folder ${folder.name}`}
                >
                  <Trash size={20} className={NEON_RED} />
                </button>
                {/* Edit Button - Neon Fuchsia */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent folder click navigation
                    setShowFolderRename(true);
                    setSelectedFolder(folder);
                  }}
                  className={`p-2 rounded-lg border ${BORDER} hover:border-fuchsia-400 transition-colors duration-200`}
                  aria-label={`Rename folder ${folder.name}`}
                >
                  <Edit size={20} className={NEON_FUCHSIA} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Render Files */}
        <div className="space-y-3">
          {filesList.map((file) => (
            <div
              key={file.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${ITEM_BG} backdrop-blur-sm rounded-xl ${BORDER} shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-cyan-400/50`}
            >
              {/* File Info & Primary Actions (Mobile-friendly stacking) */}
              <div className="flex items-center gap-4 mb-3 sm:mb-0 flex-grow">
                <FileText className={`${NEON_CYAN} w-5 h-5 flex-shrink-0`} />
                <span
                  title={file.name}
                  className="text-sm sm:text-base font-semibold text-gray-200 truncate block max-w-xs sm:max-w-md md:max-w-lg"
                >
                  {file.name}
                </span>
              </div>

              {/* Action Buttons (Grouped) */}
              <div className="flex flex-wrap gap-3 justify-end sm:justify-start">
                {/* Open Button - Neon Cyan */}
                <button
                  onClick={() => handleOpenFile(file)}
                  className={`p-2 rounded-lg border ${BORDER} hover:border-cyan-400 transition-colors duration-200`}
                  aria-label={`Open file ${file.name}`}
                >
                  <ExternalLink size={20} className={NEON_CYAN} />
                </button>
                {/* Download Button - Neon Teal */}
                <button
                  onClick={() => handleDownloadFile(file)}
                  className={`p-2 rounded-lg border ${BORDER} hover:border-teal-400 transition-colors duration-200`}
                  aria-label={`Download file ${file.name}`}
                >
                  <Download size={20} className={NEON_TEAL} />
                </button>
                {/* Edit Button - Neon Fuchsia */}
                <button
                  onClick={() => {
                    setShowRenameComp(true);
                    setOldFilename(file);
                  }}
                  className={`p-2 rounded-lg border ${BORDER} hover:border-fuchsia-400 transition-colors duration-200`}
                  aria-label={`Rename file ${file.name}`}
                >
                  <Edit size={20} className={NEON_FUCHSIA} />
                </button>
                {/* Trash Button - Neon Red */}
                <button
                  onClick={() => {
                    setShowDeletePopup(true);
                    setOldFilename(file);
                  }}
                  className={`p-2 rounded-lg border ${BORDER} hover:border-rose-500 transition-colors duration-200`}
                  aria-label={`Delete file ${file.name}`}
                >
                  <Trash size={20} className={NEON_RED} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup UI element - Elevated and styled */}
      {showPopup && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-fuchsia-400 text-white p-4 rounded-lg shadow-2xl shadow-fuchsia-400/30 z-50 animate-fade-in-down transition-all duration-300">
          <p className="text-md font-semibold text-cyan-400">{popupMessage}</p>
        </div>
      )}

      {/* Popups (Assuming RenameFile, ConfirmPopup, CreateFolder, UploadForm are styled dark/neon too) */}
      {showRenameComp && (
        <RenameFile
          onClose={() => setShowRenameComp(false)}
          OnRenameConfirm={handleFileSave}
          fileName={oldFilename?.name}
        />
      )}
      {showDeletePopup && (
        <ConfirmPopup
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={() => handleDeleteFile(oldFilename)}
          filename={oldFilename?.name}
          headTitle="Delete File"
          action="Delete"
        />
      )}
      {showFolderRename && (
        <RenameFile
          onClose={() => setShowFolderRename(false)}
          OnRenameConfirm={handleFolderRename}
          fileName={selectedFolder?.name}
        />
      )}
      {showFolderDelete && (
        <ConfirmPopup
          onCancel={() => setShowFolderDelete(false)}
          onConfirm={() => handleDeleteFolder(selectedFolder)}
          filename={selectedFolder?.name}
          headTitle="Delete Folder"
          action="Delete"
        />
      )}
      {showUpload && (
        <UploadForm 
          path={dirid} 
          onClose={() => setShowUpload(false)} 
          fetchFiles={fetchFiles} // Added fetchFiles to re-fetch after upload
        />
      )}
    </div>
  );
};