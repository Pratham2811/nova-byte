import React from 'react';
import { X, Download, ExternalLink, ZoomIn, ZoomOut, Info, Printer, RotateCw, Link } from 'lucide-react';
import { Modal, Button, IconButton } from '@/shared/components';
import { getFileIcon } from '../constants/file.constants.js';
/**
 * File Viewer Component
 * Modal to preview and interact with files
 * 
 * @param {Object} props
 * @param {Object} props.file - File object to view
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onDownload - Download handler (optional)
 */
export const FileViewer = ({ file, onClose, onDownload }) => {
  const [zoom, setZoom] = React.useState(100);
  const [showInfo, setShowInfo] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);
  const contentRef = React.useRef(null);

  if (!file) return null;
  
  const fileUrl = `http://localhost:80/api/file/${file.id}`;
  const FileIcon = getFileIcon(file.mimeType || file.type);
  const isImage = file.mimeType?.startsWith('image/');
  const isPDF = file.mimeType === 'application/pdf';
  const isVideo = file.mimeType?.startsWith('video/');
  const isAudio = file.mimeType?.startsWith('audio/');

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handlePrint = () => {
    const printWindow = window.open(fileUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreview = () => {
    if (isImage) {
      return (
        <div 
          className="flex-1 overflow-auto flex items-center justify-center p-8 transition-all duration-200"
          style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
        >
          <img
            src={fileUrl}
            alt={file.name}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl"
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="flex-1 w-full h-full p-4 bg-gray-900/50">
          <iframe
            src={fileUrl}
            className="w-full h-full rounded bg-white"
            title={file.name}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex-1 flex items-center justify-center bg-black">
          <video
            src={fileUrl}
            controls
            className="max-w-full max-h-[85vh]"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center">
            <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <FileIcon size={64} className="text-blue-400" />
            </div>
            <h3 className="text-white text-lg font-medium mb-6">{file.name}</h3>
            <audio src={fileUrl} controls className="w-full min-w-[300px]" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 text-gray-300">
        <FileIcon size={96} className="text-gray-500 mb-6" />
        <p className="text-lg">No preview available</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => onDownload && onDownload(file)}
          icon={<Download size={18} />}
        >
          Download File
        </Button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Header Toolbar */}
      <div className="h-16 flex items-center justify-between px-4 bg-gray-900/50 border-b border-white/10">
        <div className="flex items-center gap-4">
          <IconButton 
            icon={<X size={20} />} 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          />
          <div className="flex items-center gap-3">
            <FileIcon size={20} className="text-blue-400" />
            <span className="text-white font-medium truncate max-w-xs">{file.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isImage && (
            <>
              <div className="flex items-center bg-gray-800 rounded-lg mr-2 p-1">
                <IconButton 
                  icon={<div className="font-mono text-xs">{zoom}%</div>}
                  className="text-gray-300 w-12 hover:bg-transparent cursor-default"
                />
                <IconButton 
                  icon={<ZoomOut size={18} />} 
                  onClick={handleZoomOut}
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  disabled={zoom <= 25}
                />
                <IconButton 
                  icon={<ZoomIn size={18} />} 
                  onClick={handleZoomIn}
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  disabled={zoom >= 300}
                />
              </div>
              <IconButton 
                icon={<RotateCw size={18} />} 
                onClick={handleRotate}
                title="Rotate"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              />
            </>
          )}

          <IconButton 
            icon={<Link size={18} />} 
            onClick={() => {
              navigator.clipboard.writeText(fileUrl);
              // You might want to show a toast here, but for now simple copy
            }}
            title="Copy Link"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          />
          
          <IconButton 
            icon={<Printer size={18} />} 
            onClick={handlePrint}
            title="Print"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          />
          
          {onDownload && (
            <IconButton 
              icon={<Download size={18} />} 
              onClick={() => onDownload(file)}
              title="Download"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            />
          )}

          <IconButton 
            icon={<Info size={18} />} 
            onClick={() => setShowInfo(!showInfo)}
            title="File Details"
            className={`text-gray-400 hover:text-white hover:bg-gray-800 ${showInfo ? 'bg-gray-800 text-white' : ''}`}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Canvas */}
        <div className="flex-1 flex relative overflow-hidden bg-black/50">
          {renderPreview()}
        </div>

        {/* Info Sidebar */}
        {showInfo && (
          <div className="w-80 bg-white border-l border-gray-200 p-6 shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Details</h3>
              <IconButton 
                icon={<X size={18} />} 
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:bg-gray-100"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Type</label>
                <div className="flex items-center gap-2 text-gray-900">
                  <FileIcon size={16} className="text-gray-500" />
                  <span>{file.mimeType || 'Unknown Type'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Size</label>
                <div className="text-gray-900">{formatSize(file.size)}</div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                <div className="text-gray-900 break-all text-sm font-mono bg-gray-50 p-2 rounded">
                  {file.path || '/'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Modified</label>
                <div className="text-gray-900">
                  {new Date(file.updatedAt || Date.now()).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
