import React, { useState, useEffect } from "react";
import { CornerUpLeft, FileX, Trash } from "lucide-react";
import { ConfirmPopup } from "./ComfirmUi";
import { RiDeleteBin5Line } from "react-icons/ri";

// Define Theme Colors/Styles
const NEON_FUCHSIA = "fuchsia-400";
const NEON_RED = "rose-500";
const NEON_GREEN = "emerald-400"; // For restore action
const ITEM_BG = "bg-gray-800/40 backdrop-blur-md";
const BORDER = "border-gray-700/50";
const TRASH_GRADIENT = `bg-gradient-to-r from-rose-500 to-fuchsia-500`;

const TrashFiles = () => {
  const [trashFiles, setTrashFiles] = useState([]);
  const [trashDirectories, setTrashDirectories] = useState([]); // Still setting, but not used for rendering files
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false); // For RESTORE
  const [restoredFilename, setRestoredFilename] = useState(null); // Holds the file object
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // For PERMANENT DELETE

  const fetchTrashFiles = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:80/trash`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Server responded with status: ${response.status}`);
      const data = await response.json();

      setTrashFiles(data.filesList || []);
      setTrashDirectories(data.directoriesList || []); // Keeping original logic, but not using it for display
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

  const handleRestore = async (file) => {
    const url = `http://localhost:80/trash/restore-file/${file.id}`;
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ FilenametoRestore: file.name }),
      });
      if (!response.ok) throw new Error(`Error restoring file`);
      await response.text();
      setShowConfirm(false);
      fetchTrashFiles();
    } catch (err) {
      console.log("Error restoring file:", err);
    }
  };

  const handlePermanentDelete = async (file) => {
    const url = `http://localhost:80/trash/delete-permanent/${file.id}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data.message);
    setShowConfirmDelete(false);
    fetchTrashFiles();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px] text-gray-400">
        <p className={`text-lg text-${NEON_FUCHSIA} animate-pulse`}>Initializing deletion matrix...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px] text-red-400">
        <p className="bg-rose-900/40 p-4 rounded-lg font-bold">{error}</p>
      </div>
    );
  }

  const allTrashFilesToDisplay = trashFiles || []; // Only use trashFiles for display

  return (
    <div className="p-4 sm:p-6 md:p-8 flex-1">
      {/* Title: Neon Red/Pink Gradient */}
      <h1 className={`text-3xl font-extrabold mb-8 text-transparent bg-clip-text ${TRASH_GRADIENT} tracking-wider uppercase border-b border-rose-500/30 pb-4`}>
        DELETED FILES
      </h1>

      {allTrashFilesToDisplay.length === 0 ? (
        <div className="text-center text-gray-400 py-10 text-lg">
          <Trash size={30} className="mx-auto mb-3 text-gray-600" />
          <p>The trash segment is clear. No file residuals detected.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {allTrashFilesToDisplay.map((file, index) => (
            <li
              key={index}
              className={`${ITEM_BG} ${BORDER} rounded-xl 
                          shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300
                          p-4 flex flex-col justify-between items-start gap-4`} 
            >
              <div className="flex items-center gap-3 w-full"> {/* Ensures full width for name + icon */}
                {/* File Icon */}
                <FileX className={`w-6 h-6 flex-shrink-0 text-${NEON_FUCHSIA}`} />
                
                {/* File Name - Truncates if too long */}
                <span
                  className="text-gray-200 font-semibold truncate flex-grow text-base"
                  title={file.name}
                >
                  {file?.name}
                </span>
              </div>

              {/* Action Buttons - Aligned to end */}
              <div className="flex gap-2 w-full justify-end"> 
                
                {/* Restore Button */}
                <button
                  onClick={() => {
                    setShowConfirm(true);
                    setRestoredFilename(file);
                  }}
                  className={`p-2 rounded-full border ${BORDER} hover:border-${NEON_GREEN}
                                hover:bg-gray-700/40 transition-all shadow-md`}
                  title={`Restore ${file.name}`}
                >
                  <CornerUpLeft className={`w-5 h-5 text-${NEON_GREEN}`} />
                </button>
                
                {/* Permanent Delete Button */}
                <button
                  onClick={() => {
                    setShowConfirmDelete(true);
                    setRestoredFilename(file);
                  }}
                  className={`p-2 rounded-full border ${BORDER} hover:border-${NEON_RED}
                                hover:bg-gray-700/40 transition-all shadow-md`}
                  title={`Permanently Delete ${file.name}`}
                >
                  <RiDeleteBin5Line className={`w-5 h-5 text-${NEON_RED}`} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Confirmation Popups */}
      {showConfirm && (
        <ConfirmPopup
          filename={restoredFilename?.name}
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => handleRestore(restoredFilename)}
          headTitle="Restore File"
          action="Restore"
        />
      )}

      {showConfirmDelete && (
        <ConfirmPopup
          filename={restoredFilename?.name}
          onCancel={() => setShowConfirmDelete(false)}
          onConfirm={() => handlePermanentDelete(restoredFilename)}
          headTitle="Delete File Permanently"
          action="Delete"
        />
      )}
    </div>
  );
};

export default TrashFiles;