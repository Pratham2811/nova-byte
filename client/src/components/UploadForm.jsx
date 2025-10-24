import React, { useState } from "react";
import { Upload, File as FileIcon, CheckCircle, XCircle } from "lucide-react";
import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const NEON_CYAN = "cyan-400";
const NEON_FUCHSIA = "fuchsia-400";
const NEON_GREEN = "emerald-400";
const NEON_RED = "rose-500";
const MAIN_GRADIENT = `bg-gradient-to-r from-cyan-400 to-fuchsia-500`;
const BUTTON_GRADIENT = `bg-gradient-to-r from-cyan-600 to-fuchsia-700`;
const HOVER_GRADIENT = `hover:from-cyan-500 hover:to-fuchsia-600`;
const SHADOW_CYAN = `shadow-cyan-500/50`;

export const UploadForm = ({ path }) => {
const [uploadFiles, setUploadFiles] = useState([]);
const [uploadStatus, setUploadStatus] = useState("");
const [progress, setProgress] = useState(0);
const [statusType, setStatusType] = useState("");
const navigate=useNavigate()
const handleChange = (event) => {
const files = Array.from(event.target.files);
if (files.length > 0) {
setUploadFiles(files);
setUploadStatus(`${files.length} file(s) ready for upload`);
setStatusType("");
setProgress(0);
}
};

const handleUpload = async () => {
if (uploadFiles.length === 0) {
setUploadStatus("Please select files first. No data streams detected.");
setStatusType("error");
return;
}


const formData = new FormData();
uploadFiles.forEach((file) => {
  formData.append("uploadedFiles", file);
});
formData.append("parentDirId", path);

try {
  setProgress(0);
  setUploadStatus("Initializing upload streams...");
  setStatusType("");

  const progressInterval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) return 90;
      return prev + 10;
    });
  }, 150);

  const response = await fetch("http://localhost:80/file/upload", {
    method: "POST",
    body: formData,
    credentials:"include"
  });

  clearInterval(progressInterval);

  if (response.ok) {
    setUploadStatus("All files uploaded successfully. Data verified.");
    setStatusType("success");
    setProgress(100);
    setUploadFiles([]);
  } else {
    const errorText = await response.text();
    setUploadStatus(`Upload failed: ${errorText || response.statusText}`);
    setStatusType("error");
    setProgress(100);
    if(response.status===401){
        setTimeout(()=>{
            navigate("/login")
        },5000)
    }
  }
} catch (err) {
  console.error("Upload error:", err);
  setUploadStatus("Critical upload error. Connection terminated.");
  setStatusType("error");
  setProgress(100);
}


};

const handleCancelFile = (index) => {
const updatedFiles = uploadFiles.filter((_, i) => i !== index);
setUploadFiles(updatedFiles);
if (updatedFiles.length === 0) {
setUploadStatus("");
setProgress(0);
setStatusType("");
}
};

return ( <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-[400px]">
<div
className={`bg-gray-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-2xl shadow-2xl border border-${NEON_CYAN}/50 w-full max-w-xl`}
>
<h2
className={`text-2xl sm:text-3xl font-extrabold mb-8 text-center text-transparent bg-clip-text ${MAIN_GRADIENT} tracking-wider`}
>
MULTI-FILE DATA UPLOAD </h2>


    <div className="space-y-6">
      {/* File Selection */}
      <div className="space-y-4">
        <label
          htmlFor="files"
          className={`text-base font-semibold text-${NEON_CYAN} block`}
        >
          Select files for transmission:
        </label>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label
            htmlFor="files"
            className={`cursor-pointer flex items-center gap-2 px-5 py-3 ${BUTTON_GRADIENT} ${HOVER_GRADIENT} text-white text-base font-bold rounded-xl shadow-lg shadow-${NEON_FUCHSIA}/30 transition-all duration-300 hover:scale-[1.03]`}
          >
            <Upload className="w-5 h-5" />
            INITIATE MULTI-STREAM
          </label>
          <input
            id="files"
            type="file"
            multiple
            accept="*"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        {/* File List Display */}
        {uploadFiles.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {uploadFiles.map((file, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 text-gray-300 text-sm p-2 bg-gray-800/60 rounded-lg border border-${NEON_FUCHSIA}/40`}
              >
                <FileIcon className={`w-4 h-4 text-${NEON_FUCHSIA}`} />
                <span className="truncate flex-1">{file.name}</span>
                <button
                  onClick={() => handleCancelFile(index)}
                  title="Remove this file"
                >
                  <MdCancel
                    className={`text-${NEON_RED} w-5 h-5 hover:scale-110 transition-transform`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 pt-1">
          PROTOCOL:{" "}
          <span className={`text-${NEON_CYAN}`}>
            Multi-File Secure Stream
          </span>{" "}
          — MAX PACKET SIZE: 50MB per file
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
          className={`flex items-center gap-2 text-sm p-3 rounded-lg border ${
            statusType === "success"
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

    <div className="mt-10">
      <button
        onClick={handleUpload}
        disabled={uploadFiles.length === 0 || progress > 0}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 w-full ${
          uploadFiles.length === 0 || progress > 0
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : `${BUTTON_GRADIENT} ${HOVER_GRADIENT} transform hover:scale-[1.01] shadow-xl ${SHADOW_CYAN}`
        }`}
      >
        <Upload size={18} />
        {progress > 0 ? `TRANSMITTING ${progress}%` : "EXECUTE UPLOAD"}
      </button>
    </div>
  </div>
</div>

);
};
