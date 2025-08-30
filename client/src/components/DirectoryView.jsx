import React, { useState, useEffect } from "react";

import {
  Download,
  ExternalLink,
  Folder,
  FileText,
  Delete,
  Edit,
  Trash,
} from "lucide-react";
import { useShowPopup } from "@/hooks/useShowPopup";
import { RenameFile } from "@/components/RenameFile";
import { ConfirmPopup } from "./ComfirmUi";
import { useNavigate, useParams } from "react-router-dom";
export const FileList = () => {
  const [fileList, setFileList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showPopup, popupMessage, show } = useShowPopup();
  const [oldFilename, setOldFilename] = useState(null);
  const [showRenameComp, setShowRenameComp] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const {"*":dirPath}=useParams()
  console.log(dirPath);
 
  const navigate=useNavigate()
  
  const fetchFiles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:80/directory/${dirPath}`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      setFileList(data);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [dirPath]);

  const handleFolderClick = async (folderName) => {
// ✅ push new route

    const newPath = dirPath ? `${dirPath}/${folderName}` : folderName;
    navigate(`/${newPath}`);

    
  };

  const handleGoBack = () => {
    const pathArray = dirPath.split("/");
    pathArray.pop();
   
  };

  const handleOpenFile = async (fileName) => {
    const filePath = dirPath
      ? `${dirPath}/${fileName}?action=open`
      : `${fileName}?action=open`;
    const url = `http://localhost:80/files/${dirPath}/${filePath}`;

    try {
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error opening file:", err);
    }
  };

  const handleDownloadFile = (fileName) => {
    const filePath = dirPath
      ? `${dirPath}/${fileName}?action=download`
      : `${fileName}?action=download`;
    const url = `http://localhost:80/files/${dirPath}/${filePath}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDeleteFile = async (oldFilename) => {
    const filePath = dirPath
      ? `${dirPath}/${oldFilename}`
      : `${oldFilename}`;
    const url = `http://localhost:80/files/${dirPath}/${filePath}`;

    try {
      console.log(url);

      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      console.log(data);
      setShowDeletePopup(false);
      // console.log(`File deleted: ${await res.json()}`);
      show(`${oldFilename} ${data?.message} ✅`);

      fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };
  const handleFileSave = async (fileName) => {
    console.log("Filename from rename componenet", fileName);
    const filepath = dirPath
      ? `${dirPath}/${oldFilename}`
      : oldFilename;
    const url = `http://localhost:80/files/${dirPath}/${filepath}`;
    // //making request
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ fileName }),
      });
      if (!response.ok) throw new Error(`Error${response.statusText}`);
      const data = await response.text();
      console.log("File Renamed scuessfully:", data);
      fetchFiles();
    } catch (error) {
      console.log("Could Not Fetch the file :", error);
    }
    setShowRenameComp(false);
  };
  return (
    <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col bg-gray-900 text-gray-100">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
            File Explorer
          </h2>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Path:</span>
          <span className="font-medium text-gray-300">
            /{dirPath || "Root"}
          </span>
          {dirPath && (
            <button
              onClick={handleGoBack}
              className="px-2 py-1 text-xs rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
            >
              Back
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-10">Loading files...</div>
      )}
      {error && (
        <div className="text-center text-red-400 py-10">
          Error: Could not fetch files.
        </div>
      )}
      {!loading && fileList.length === 0 && (
        <div className="text-center text-gray-400 py-10">No files found.</div>
      )}

      <div className="space-y-3">
        {fileList.map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 transition-all duration-200 hover:scale-[1.01] hover:bg-gray-700/50"
          >
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              {item.type === "folder" ? (
                <Folder className="text-teal-400 w-6 h-6" />
              ) : (
                <FileText className="text-blue-400 w-5 h-5" />
              )}
              <span
                title={item.name} // 👈 tooltip on hover
                className="text-sm sm:text-base font-semibold text-gray-200 truncate block max-w-[600px] cursor-pointer"
              >
                {item.name}
              </span>
            </div>

            <div className="flex flex-wrap gap-12">
              {item.type === "folder" ? (
                <button
                  onClick={() => handleFolderClick(item.name)}
                  className="flex items-center gap-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200"
                >
                  <ExternalLink size={14} /> Open
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleOpenFile(item.name)}
                    className="p-2 rounded-full border border-transparent hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                  >
                    <ExternalLink size={20} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDownloadFile(item.name)}
                    className="p-2 rounded-full border border-transparent hover:border-teal-400 transition-colors duration-200 cursor-pointer"
                  >
                    <Download size={20} className="text-teal-400" />
                  </button>
                  <button
                    onClick={() => {
                      setShowDeletePopup(true);
                      setOldFilename(item.name);
                    }}
                    className="p-2 rounded-full border border-transparent hover:border-red-400 transition-colors duration-200 cursor-pointer"
                  >
                    <Trash size={20} className="text-red-400" />
                  </button>
                  <button
                    onClick={() => {
                      setShowRenameComp(true);
                      setOldFilename(item.name);
                    }}
                    className="p-2 rounded-full border border-transparent hover:border-gray-400 transition-colors duration-200 cursor-pointer"
                  >
                    <Edit size={20} className="text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Popup UI element - it will be visible only when `showPopup` is true */}
      {showPopup && (
        <div className="fixed top-1/8 left-1/2 transform -translate-x--3/2 -translate-y-1/2 bg-gray-800 text-white p-6 rounded-lg shadow-2xl z-50 animate-fade-in-down transition-all duration-300">
          <p className="text-lg font-semibold">{popupMessage}</p>
        </div>
      )}
      {showRenameComp && (
        <RenameFile
          onClose={() => setShowRenameComp(false)}
          OnRenameConfirm={handleFileSave}
          fileName={oldFilename}
        />
      )}
      {showDeletePopup && (
        <ConfirmPopup
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={handleDeleteFile}
          filename={oldFilename}
          headTitle="Delete File"
          action="Delete"
        />
      )}
    </div>
  );
};
