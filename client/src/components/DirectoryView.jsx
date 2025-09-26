import React, { useState, useEffect } from "react";
import {
  Download,
  ExternalLink,
  Folder,
  FileText,
  Delete,
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
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showPopup, popupMessage, show } = useShowPopup();
  const [oldFilename, setOldFilename] = useState(null);
  const [showRenameComp, setShowRenameComp] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const[ShowUpload,setShowUpload]=useState(false);

  let { "*": dirPath } = useParams();
  const navigate = useNavigate();

  const fetchFiles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:80/directory/${dirPath}`);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      console.log("Hiii");
      
      setFileList(data);
      console.log(data);
      
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [dirPath]);

  // Go back one directory in path
  const handleGoBack = () => {
    if (!dirPath) return;
    const parts = dirPath.split("/");
    parts.pop();
    const newPath = parts.join("/");
    navigate(newPath ? "/" + newPath : "/");
  };

  const handleFolderClick = async (folderName) => {
    // Push new route for folder navigation
    const newPath = dirPath ? `${dirPath}/${folderName}` : folderName;
    navigate(`/${newPath}`);
  };

  const handleOpenFile = async (file) => {
    const filePath = dirPath
      ? `${dirPath}/${file.id}?action=open`
      : `${file.id}?action=open`;
    const url = `http://localhost:80/file/${filePath}`;

    try {
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error opening file:", err);
    }
  };

  const handleDownloadFile = (file) => {
    const filePath = dirPath
      ? `${dirPath}/${file.id}?action=download`
      : `${file.id}?action=download`;
    const url = `http://localhost:80/file/${filePath}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.id;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDeleteFile = async (file) => {
    const filePath = dirPath ? `${dirPath}/${file.id}` : `${file.id}`;
    const url = `http://localhost:80/file/${filePath}`;
   console.log(file.id);
   
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      setShowDeletePopup(false);
      show(`${file.name} ${data?.message} ✅`);
      fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleFileSave = async (newFilename,fileObject) => {
    const filePath = dirPath ? `${dirPath}/` : "";
    const url = `http://localhost:80/file/rename/`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ oldFilename, newFilename }),
      });
      if (!response.ok) throw new Error(`Error${response.statusText}`);
      const data = await response.text();
      console.log(data);

      fetchFiles();
    } catch (error) {
      console.log("Could Not Fetch the file :", error);
    }
    setShowRenameComp(false);
  };

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
        <div className="flex">
          <CreateFolder directoryPath={dirPath} fetchFiles={fetchFiles} />
          <button onClick={()=>{
           setShowUpload(true);
          }} >
            <Upload />
          </button>
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
      {!loading && fileList.files.length === 0 && (
        <div className="text-center text-gray-400 py-10">No files found.</div>
      )}

      <div className="space-y-3">
        {fileList.files.map((item, index) => (
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
                title={item.name}
                className="text-sm sm:text-base font-semibold text-gray-200 truncate block max-w-[600px] cursor-pointer"
              >
                {item.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-12">
              {item.type === "folder" ? (
                <div className="flex flex-wrap gap-12">
                  <button
                    onClick={() => handleFolderClick(item.name)}
                    className="flex items-center gap-1 bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 cursor-pointer"
                  >
                    <ExternalLink size={14} /> Open
                  </button>
                  <button
                    onClick={() => {
                      setShowDeletePopup(true);
                      setOldFilename(item);
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
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleOpenFile(item)}
                    className="p-2 rounded-full border border-transparent hover:border-blue-400 transition-colors duration-200  cursor-pointer"
                  >
                    <ExternalLink size={20} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDownloadFile(item)}
                    className="p-2 rounded-full border border-transparent hover:border-teal-400 transition-colors duration-200 cursor-pointer "
                  >
                    <Download size={20} className="text-teal-400" />
                  </button>
                  <button
                    onClick={() => {
                      setShowDeletePopup(true);
                      setOldFilename(item);
                    }}
                    className="p-2 rounded-full border border-transparent hover:border-red-400 transition-colors duration-200 cursor-pointer"
                  >
                    <Trash size={20} className="text-red-400" />
                  </button>
                  <button
                    onClick={() => {
                      setShowRenameComp(true);
                      setOldFilename(item);
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
      {/* Popup UI element */}
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
      {ShowUpload&&(
        <UploadForm path={dirPath}/>
      )}
    </div>
  );
};
