import React, { useState, useEffect } from "react";
import { CornerUpLeft } from "lucide-react"; // new restore icon
import { ConfirmPopup } from "./ComfirmUi";


const TrashFiles = () => {
  const [trashFiles, setTrashFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [restoredFilename, setRestoredFilename] = useState(null);

  const fetchTrashFiles = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:80/trash`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();
      setTrashFiles(data);
    } catch (err) {
      console.error("Failed to fetch trash files:", err);
      setError("Failed to load trash files. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashFiles();
  }, []);

  const handleRestore = async (filename) => {
    const url = `http://localhost:80/trash/restore-file/`;
    try {
      const response = await fetch(url, { 
        method: "PATCH" ,
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({FilenametoRestore:filename})

      });
      if (!response.ok) throw new Error(`Error restoring file`);
      await response.text();
      setShowConfirm(false);
      fetchTrashFiles();
    } catch (err) {
      console.log("Error restoring file:", err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full text-gray-400">Loading trash files...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full text-red-400">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500">
        Trash Files
      </h1>

      {trashFiles.length === 0 ? (
        <p className="text-gray-400">Your trash is empty.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trashFiles.map((file, index) => (
            <li
              key={index}
              className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl 
                         shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300
                         p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="lucide lucide-file-x text-red-400 w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <path d="M14 2v6h6" />
                  <path d="m15 10-6 6" />
                  <path d="m9 10 6 6" />
                </svg>
                <span
                  className="text-gray-200 font-medium truncate max-w-[200px]"
                  title={file.name}
                >
                  {file?.name}
                </span>
              </div>

              <button
                onClick={() => {
                  setShowConfirm(true);
                  setRestoredFilename(file?.name);
                }}
                className="p-2 rounded-full border border-transparent hover:border-green-400
                           hover:bg-gray-700/40 transition-all"
                title="Restore File"
              >
                <CornerUpLeft className="w-6 h-6 text-green-400 cursor-pointer" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {showConfirm && (
        <ConfirmPopup
          filename={restoredFilename}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleRestore}
          headTitle="Restore File"
          action="Restore"
        />
      )}
    </div>
  );
};

export default TrashFiles;
