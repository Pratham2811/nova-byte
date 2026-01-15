import React, { useEffect } from "react";

// Icons (Inline SVGs for zero-dependencies)
const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);
const ExternalLinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
);
const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);
const FileIcon = () => (
  <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

export const FileViewer = ({ file, onClose }) => {
  // 1. Handle Escape Key to Close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!file) return null;

  const url = `http://localhost:80/file/${file.id}?action=open`;
  const downloadUrl = `http://localhost:80/file/${file.id}?action=download`;
  const ext = file.extension.toLowerCase();

  const isVideo = [".mp4", ".mov", ".webm"].includes(ext);
  const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
  const isPDF = ext === ".pdf";
  const isText = [".txt", ".csv", ".log", ".json", ".xml", ".md", ".js", ".html", ".css"].includes(ext);

  // 2. Render Content Logic
  let content;

  if (isVideo) {
    content = (
      <video
        controls
        autoPlay
        className="max-h-[85vh] max-w-[90vw] outline-none rounded shadow-2xl bg-black"
      >
        <source src={url} type={`video/${ext.substring(1)}`} />
        Your browser does not support the video tag.
      </video>
    );
  } else if (isImage) {
    content = (
      <img
        src={url}
        alt={file.name}
        className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
      />
    );
  } else if (isPDF) {
    content = (
      <div className="w-[90vw] h-[85vh] bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <iframe
          src={url}
          className="w-full h-full border-none"
          title={`PDF Preview: ${file.name}`}
        />
      </div>
    );
  } else if (isText) {
    content = (
      <div className="w-[80vw] h-[80vh] bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
        <iframe
          src={url}
          className="w-full h-full bg-gray-900 text-gray-300 p-4"
          title={`Text Preview: ${file.name}`}
          style={{ 
             // Apply basic styling to the iframe content context if possible, 
             // though styling iframe internals is restricted by cross-origin if distinct.
             colorScheme: "dark" 
          }}
        />
      </div>
    );
  } else {
    // Unsupported / Fallback View
    content = (
      <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-900 rounded-xl border border-gray-700 shadow-2xl max-w-md w-full">
        <div className="mb-6 p-4 bg-gray-800 rounded-full">
          <FileIcon />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Preview Available
        </h3>
        <p className="text-gray-400 mb-8">
          We can't preview <strong>{ext}</strong> files directly in the browser.
        </p>
        <a
          href={downloadUrl}
          download
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
        >
          <DownloadIcon />
          Download File
        </a>
      </div>
    );
  }

  return (
    // 3. Immersive Overlay Container
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm animate-fade-in">
      
      {/* Top Toolbar - Google Drive Style
        Floats at the top, transparent gradient background 
      */}
      <div className="h-16 flex items-center justify-between px-6 z-50 bg-gradient-to-b from-black/80 to-transparent">
        
        {/* Left: File Details */}
        <div className="flex items-center gap-4 min-w-0">
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            title="Close"
          >
            <CloseIcon />
          </button>
          <h2 className="text-gray-200 font-medium truncate text-lg select-none" title={file.name}>
            {file.name}
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
           {/* Open in New Tab Button */}
           <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Open in new tab"
          >
            <ExternalLinkIcon />
          </a>

          {/* Download Button */}
          <a
            href={downloadUrl}
            download
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors"
            title="Download"
          >
            <DownloadIcon />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      {/* Main Content Area 
        Flex-grow takes remaining space. Center alignment.
      */}
      <div 
        className="flex-grow flex items-center justify-center p-4 overflow-auto"
        onClick={onClose} // Clicking the dark background closes modal
      >
        <div 
            onClick={(e) => e.stopPropagation()} // Clicking content does NOT close modal
            className="relative flex justify-center items-center w-full h-full"
        >
            {content}
        </div>
      </div>
    </div>
  );
};