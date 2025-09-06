import React, { useState } from "react";

const CreateFolder = ({ directoryPath, fetchFiles }) => {
  const [folderName, setFolderName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");


  const handleDirectory = async () => {
    if (!folderName.trim()){
         setMessage("Enter valid Folder Name");
         return
    } 

    try {
      const response = await fetch("http://localhost:80/create-directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: directoryPath + "/" + folderName.trim() }),
      });

      if (!response.ok) throw new Error("Error creating directory");

      const data = await response.text();
      console.log(data);

      setFolderName("");
      setShowPopup(false);
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Create Directory
      </h3>

      {/* Button to open popup */}
      <button
        onClick={() => setShowPopup(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Create Directory
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background Overlay */}
          <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

          {/* Popup Content */}
          <div
            className="relative bg-gray-900 backdrop-blur-xl 
                        p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm border border-white/20 
                        dark:border-gray-700/30"
          >
            <h4 className="text-lg font-semibold text-white mb-3">
              New Folder
            </h4>
          <p className="text-red-500">{message}</p>
            <input
              type="text"
              placeholder="Enter folder name"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setMessage("");
              }}
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded-md mb-4 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setFolderName("");
                  setMessage("")
                }}
                className="px-4 py-2 rounded-xl border bg-gray-400 border-gray-300 dark:border-gray-700 
                           text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDirectory}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateFolder;
