import React, { useState, useEffect } from "react";
import {
  Download,
  ExternalLink,
  Folder,
  FileText,
  Edit,
  Trash,
  Upload,
} from "lucide-react";
import { useShowPopup } from "@/hooks/useShowPopup";
import { RenameFile } from "@/components/RenameFile";
import { ConfirmPopup } from "./ComfirmUi";
import { useNavigate, useParams } from "react-router-dom";
import CreateFolder from "./CreateFolder";
import { UploadForm } from "./UploadForm";
import { IoIosArrowBack } from "react-icons/io";

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

  let { "*": dirPath } = useParams();
  const navigate = useNavigate();

  const fetchFiles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:80/directory/${dirPath || ""}`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
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
  }, [dirPath]);
console.log(filesList);
      console.log(directoriesList);
  // Go back one directory in path
  const handleGoBack = () => {
    if (!dirPath) return;
    const parts = dirPath.split("/");
    parts.pop();
    const newPath = parts.join("/");
    navigate(newPath ? "/" + newPath : "/");
  };

  const handleFolderClick = (folderId) => {
    // Push new route for folder navigation
    const newPath = dirPath ? `${dirPath}/${folderId}` : folderId;
    navigate(`/${folderId}`);
  };

  const handleOpenFile = (file) => {
    const filePath = dirPath ? `${dirPath}/${file.id}?action=open` : `${file.id}?action=open`;
    const url = `http://localhost:80/file/${filePath}`;
    window.open(url, "_blank");
  };

  const handleDownloadFile = (file) => {
    const filePath = dirPath ? `${dirPath}/${file.id}?action=download` : `${file.id}?action=download`;
    const url = `http://localhost:80/file/${filePath}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name; // more useful for user
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDeleteFile = async (file) => {
    const filePath = dirPath ? `${dirPath}/${file.id}` : `${file.id}`;
    const url = `http://localhost:80/file/${filePath}`;
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      setShowDeletePopup(false);
      show(`${file.name} ${data?.message} ✅`);
      fetchFiles();
    } catch (err) {
      setError("Error deleting file");
    }
  };

  const handleFileSave = async (newFilename) => {
    const url = `http://localhost:80/file/rename/`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ oldFilename: oldFilename.name, newFilename }),
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      await response.text();
      fetchFiles();
    } catch (error) {
      setError("Error renaming file");
    }
    setShowRenameComp(false);
  };

  // Empty state checks
  const isEmpty =
    directoriesList.length === 0 && filesList.length === 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col bg-gray-900 text-gray-100">
      {/* HEADER: Breadcrumb & Back on Left, CreateFolder on Right */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3">
          {dirPath && (
            <button
              onClick={handleGoBack}
              className="px-3 py-1 text-xl rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors duration-200 cursor-pointer"
            >
              <IoIosArrowBack /> 
            </button>
          )}
          <span className="font-medium text-gray-300 whitespace-nowrap" >
            /{dirPath || "Root"}
          </span>
        </div>
        {/* Right: Create Folder Button */}
        <div className="flex gap-3">
          <CreateFolder directoryPath={dirPath} fetchFiles={fetchFiles} />
          <button onClick={() => setShowUpload(true)}>
            <Upload />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-10">Loading files...</div>
      )}
      {error && (
        <div className="text-center text-red-400 py-10">
          Error: {error}
        </div>
      )}
      {!loading && isEmpty && (
        <div className="text-center text-gray-400 py-10">No files or folders found.</div>
      )}

      <div className="space-y-3">
        {/* Render Folders First */}
        {directoriesList.map((folder) => (
          <div
            key={folder.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 transition-all duration-200 hover:scale-[1.01] hover:bg-gray-700/50"
            onClick={() => handleFolderClick(folder.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              <Folder className="text-teal-400 w-6 h-6" />
              <span className="font-semibold text-gray-200">{folder.name}</span>
            </div>
          </div>
        ))}
        {/* Render Files */}
        {filesList.map((file) => (
          <div
            key={file.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 transition-all duration-200 hover:scale-[1.01] hover:bg-gray-700/50"
          >
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              <FileText className="text-blue-400 w-5 h-5" />
              <span
                title={file.name}
                className="text-sm sm:text-base font-semibold text-gray-200 truncate block max-w-[600px]"
              >
                {file.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => handleOpenFile(file)}
                className="p-2 rounded-full border border-transparent hover:border-blue-400 transition-colors duration-200 cursor-pointer"
              >
                <ExternalLink size={20} className="text-blue-400" />
              </button>
              <button
                onClick={() => handleDownloadFile(file)}
                className="p-2 rounded-full border border-transparent hover:border-teal-400 transition-colors duration-200 cursor-pointer"
              >
                <Download size={20} className="text-teal-400" />
              </button>
              <button
                onClick={() => {
                  setShowDeletePopup(true);
                  setOldFilename(file);
                }}
                className="p-2 rounded-full border border-transparent hover:border-red-400 transition-colors duration-200 cursor-pointer"
              >
                <Trash size={20} className="text-red-400" />
              </button>
              <button
                onClick={() => {
                  setShowRenameComp(true);
                  setOldFilename(file);
                }}
                className="p-2 rounded-full border border-transparent hover:border-gray-400 transition-colors duration-200 cursor-pointer"
              >
                <Edit size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup UI element */}
      {showPopup && (
        <div className="fixed top-1/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-2xl z-50 animate-fade-in-down transition-all duration-300">
          <p className="text-lg font-semibold">{popupMessage}</p>
        </div>
      )}

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
      {showUpload && (
        <UploadForm path={dirPath} onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
};
