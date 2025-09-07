import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File as FileIcon, CheckCircle, XCircle } from "lucide-react";
import { MdCancel } from "react-icons/md";
export const UploadForm = () => {
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
      setUploadStatus("Please select a file first.");
      setStatusType("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      setProgress(0);
      setUploadStatus("Uploading...");
      setStatusType("");

      // Simulated progress for UI purposes since fetch to localhost will not work
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 150);

      const response = await fetch("http://localhost:80/files/upload", {
        method: "POST",
        body: formData,
        headers: {
          filename: uploadFile.name,
        },
      });

      if (response.ok) {
        setUploadStatus("File Uploaded Successfully!");
        setStatusType("success");
        setUploadFile(null)
      } else {
        setUploadStatus("Upload failed: " + response.statusText);
        setStatusType("error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("Upload error");
      setStatusType("error");
    }
  };
  const handleCancelFile = () => {
    setUploadFile(null);
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-[400px]">
      <div className="bg-gray-800/70 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-700 w-full max-w-xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          Upload a File
        </h2>

        <div className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <label
              htmlFor="file"
              className="text-base font-semibold text-gray-400"
            >
              Select a file to upload
            </label>

            {/* Styled File Input */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label
                htmlFor="file"
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg shadow transition"
              >
                <Upload className="w-4 h-4" />
                Choose File
              </label>
              <input
                id="file"
                type="file"
                accept="*"
                onChange={handleChange}
                className="hidden"
              />

              {/* File Name Display */}
              {uploadFile && (
                <div className="flex items-center gap-2 text-gray-400 text-sm max-w-[200px]">
                  <FileIcon className="w-4 h-4 text-gray-500" />

                  <span className="truncate flex-1">{uploadFile.name}</span>

                  <button
                    className="cursor-pointer flex items-center justify-center"
                    onClick={handleCancelFile}
                  >
                    <MdCancel className="text-red-500 w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* File Restrictions */}
            <p className="text-xs text-gray-500">
              Allowed: PDF, PNG, JPG — Max size: 50MB
            </p>
          </div>

          {/* Progress Bar */}
          {progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Status Messages */}
          {uploadStatus && progress === 100 && (
            <div
              className={`flex items-center gap-2 text-sm ${
                statusType === "success"
                  ? "text-green-400"
                  : statusType === "error"
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {statusType === "success" && <CheckCircle className="w-4 h-4" />}
              {statusType === "error" && <XCircle className="w-4 h-4" />}
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="mt-8">
          <button
            onClick={handleUpload}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
          >
            <Upload size={18} /> Upload File
          </button>
        </div>
      </div>
    </div>
  );
};
