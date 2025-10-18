import React, { useState } from "react";
import { Upload, File as FileIcon, CheckCircle, XCircle } from "lucide-react";
import { MdCancel } from "react-icons/md";

// Theme Constants
const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-400";
const NEON_GREEN = "emerald-400"; // Success
const NEON_RED = "rose-500"; // Error
const MAIN_GRADIENT = `bg-gradient-to-r from-cyan-400 to-fuchsia-500`;
const BUTTON_GRADIENT = `bg-gradient-to-r from-cyan-600 to-fuchsia-700`;
const HOVER_GRADIENT = `hover:from-cyan-500 hover:to-fuchsia-600`;
const SHADOW_CYAN = `shadow-cyan-500/50`;

export const UploadForm = ({path}) => {
  console.log("path from uplaod form:",path);
  
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusType, setStatusType] = useState(""); // "success" | "error"

  const handleChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setUploadFile(file);
      setUploadStatus(`Ready to upload: ${file.name}`);
      setStatusType("");

      setProgress(0); // Reset progress on new file selection
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadStatus("Please select a file first. Data stream not initialized.");
      setStatusType("error");
      return;
    }

    const formData=new FormData();
    formData.append("uploadedFile",uploadFile)
    formData.append("parentDirId",path)
    formData.append("Filename",`${uploadFile.name}`)

    try {
      setProgress(0);
      setUploadStatus("Initializing upload stream...");
      setStatusType("");

      // Simulated progress for UI purposes
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) { // Stop just before 100 to wait for the actual response
            return 90;
          }
          return prev + 10;
        });
      }, 150);

      const response = await fetch("http://localhost:80/file/upload", {
        method: "POST",
        body: formData
      });
      
      clearInterval(progressInterval); // Stop simulation

      if (response.ok) {
        setUploadStatus("File Uploaded Successfully! Data integrity confirmed.");
        setStatusType("success");
        setProgress(100);
        setUploadFile(null)
      } else {
        const errorText = await response.text();
        setUploadStatus(`Upload failed: ${errorText || response.statusText}. Rerouting failed.`);
        setStatusType("error");
        setProgress(100);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("Critical upload error. Connection terminated.");
      setStatusType("error");
      setProgress(100);
    }
  };
  
  const handleCancelFile = () => {
    setUploadFile(null);
    setUploadStatus("");
    setProgress(0);
    setStatusType("");
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-[400px]">
      <div className={`bg-gray-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-2xl shadow-2xl border border-${NEON_CYAN}/50 w-full max-w-xl`}>
        {/* Title: Neon Gradient */}
        <h2 className={`text-2xl sm:text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text ${MAIN_GRADIENT} tracking-wider`}>
          DATA STREAM UPLOAD
        </h2>

        <div className="space-y-6">
          
          {/* File Selection */}
          <div className="space-y-4">
            <label
              htmlFor="file"
              className={`text-base font-semibold text-${NEON_CYAN} block`}
            >
              Select file for transmission:
            </label>

            {/* Styled File Input */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label
                htmlFor="file"
                className={`cursor-pointer flex items-center gap-2 px-5 py-3 ${BUTTON_GRADIENT} ${HOVER_GRADIENT} text-white text-base font-bold rounded-xl shadow-lg shadow-${NEON_FUCHSIA}/30 transition-all duration-300 hover:scale-[1.03]`}
              >
                <Upload className="w-5 h-5" />
                INITIATE FILE STREAM
              </label>
              <input
                id="file"
                type="file"
                name="fileData"
                accept="*"
                onChange={handleChange}
                className="hidden"
              />

              {/* File Name Display */}
              {uploadFile && (
                <div className={`flex items-center gap-3 text-gray-300 text-sm p-2 bg-gray-800/60 rounded-lg border border-${NEON_FUCHSIA}/40 max-w-[250px]`}>
                  <FileIcon className={`w-4 h-4 text-${NEON_FUCHSIA}`} />

                  <span className="truncate flex-1">{uploadFile.name}</span>

                  <button
                    className="cursor-pointer flex items-center justify-center"
                    onClick={handleCancelFile}
                    title="Cancel file selection"
                  >
                    <MdCancel className={`text-${NEON_RED} w-5 h-5 hover:scale-110 transition-transform`} />
                  </button>
                </div>
              )}
            </div>

            {/* File Restrictions */}
            <p className="text-xs text-gray-500 pt-1">
              PROTOCOL: <span className={`text-${NEON_CYAN}`}>Secure Multi-Format</span> — MAX PACKET SIZE: 50MB
            </p>
          </div>

          {/* Progress Bar */}
          {progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden shadow-inner shadow-black/50">
              <div
                className={`h-3 transition-all duration-300 ease-out ${MAIN_GRADIENT}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Status Messages */}
          {uploadStatus && (
            <div
              className={`flex items-center gap-2 text-sm p-3 rounded-lg border 
                ${statusType === "success" 
                  ? `text-${NEON_GREEN} bg-emerald-900/30 border-${NEON_GREEN}/50` 
                  : statusType === "error" 
                  ? `text-${NEON_RED} bg-rose-900/30 border-${NEON_RED}/50` 
                  : "text-gray-400 bg-gray-800/30 border-gray-700/50"
                }`}
            >
              {statusType === "success" && <CheckCircle className="w-4 h-4" />}
              {statusType === "error" && <XCircle className="w-4 h-4" />}
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="mt-10">
          <button
            onClick={handleUpload}
            disabled={!uploadFile || progress > 0}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 w-full ${
              !uploadFile || progress > 0
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : `${BUTTON_GRADIENT} ${HOVER_GRADIENT} transform hover:scale-[1.01] shadow-xl ${SHADOW_CYAN}`
            }`}
          >
            <Upload size={18} /> 
            {progress > 0 ? `TRANSMITTING ${progress}%` : 'EXECUTE UPLOAD'}
          </button>
        </div>
      </div>
    </div>
  );
};