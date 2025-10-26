import React from "react";
// Using the provided accent color for consistency
const NEON_RED_TEXT = "text-rose-500";
const NEON_RED_HOVER = "hover:text-rose-400";
const ACCENT_COLOR_LINK = "text-cyan-400 hover:text-cyan-300";

export const FileViewer = ({ file, onClose }) => {
  if (!file) return null;

  const url = `http://localhost:80/file/${file.id}?action=open`;
  const ext = file.extension.toLowerCase();

  // Utility to determine the viewer type
  const isVideo = [".mp4", ".mov", ".webm"].includes(ext);
  const isImage = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
  const isPDF = ext === ".pdf";
  const isText = [".txt", ".csv", ".log", ".json", ".xml", ".md"].includes(ext);

  // Determine the content to display
  let content;

  if (isVideo) {
    content = (
      <video 
        width="100%" 
        controls 
        autoPlay 
        className="max-h-[80vh] object-contain rounded-lg shadow-lg"
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
        className="max-h-[80vh] w-full object-contain rounded-lg shadow-lg"
      />
    );
  } else if (isPDF) {
    // PDF now uses max-h-screen-lg and a taller default height (800px)
    // The iframe itself is responsible for the viewing area.
    content = (
      <div className="w-full max-h-[85vh] h-[800px]"> 
        <iframe
          src={url}
          width="100%"
          height="100%" // Full height of the parent div
          title={`PDF Preview: ${file.name}`}
          className="rounded-lg border-none bg-gray-700 shadow-xl"
        ></iframe>
      </div>
    );
  } else if (isText) {
    // Text files use an iframe for better rendering of raw content
    content = (
      <iframe
        src={url}
        width="100%"
        height="500"
        title={`Text Preview: ${file.name}`}
        style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
        className="p-4 bg-gray-800 rounded-lg border border-gray-700 overflow-y-scroll"
      ></iframe>
    );
  } else {
    // Default: Download link for unsupported files
    content = (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
        <p className="text-xl text-gray-400 mb-6">
          File type **`{ext}`** is not available for direct preview.
        </p>
        <a
          href={`http://localhost:80/file/${file.id}?action=download`}
          download
          className={`text-lg font-semibold px-6 py-3 rounded-full transition duration-200 ${ACCENT_COLOR_LINK} border border-cyan-400 hover:bg-cyan-900/30`}
        >
          ⬇️ Download **{file.name}**
        </a>
      </div>
    );
  }

  return (
    // Modal Backdrop: fixed, dark overlay, centered content
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose} // Close on backdrop click
    >
      {/* Modal Container: Removed 'transform scale-95 hover:scale-100' 
        to stop the distracting zoom/scale effect on hover.
      */}
      <div
        className="relative w-full max-w-5xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl transition-transform duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header/Title Bar */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white truncate max-w-[80%]">
                Previewing: **{file.name}**
            </h2>
            {/* Close Button: Styled, with better padding and focus state */}
            <button
              onClick={onClose}
              className={`text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 ${NEON_RED_TEXT} ${NEON_RED_HOVER} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500`}
              aria-label="Close file viewer"
              title="Close (Esc)"
            >
              &times; {/* HTML entity for 'x' (times symbol) */}
            </button>
        </div>

        {/* File Content Area */}
        <div className="p-6 flex justify-center items-center">
            {content}
        </div>
      </div>
    </div>
  );
};