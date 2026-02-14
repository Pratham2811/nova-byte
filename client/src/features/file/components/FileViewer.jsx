import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Download, ExternalLink, ZoomIn, ZoomOut, 
  Info, Printer, RotateCw, Link, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getFileIcon } from '../constants/file.constants';
import { formatFileSize } from '../constants/file.constants'; // Assuming this exists from previous step
import { cn } from "@/lib/utils";

/**
 * File Viewer Component
 * Immersive modal for previewing files.
 */
export const FileViewer = ({ file, onClose, onDownload }) => {
  const [zoom, setZoom] = useState(100);
  const [showInfo, setShowInfo] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  if (!file) return null;
  
  // Reset state when file changes
  useEffect(() => {
    setZoom(100);
    setRotation(0);
    setIsLoading(true);
  }, [file.id]);

  const fileUrl = `http://localhost:80/api/file/${file.id}`; // Ensure this ENV var matches your setup
  const FileIcon = getFileIcon(file.mimeType || file.type);
  
  // Helpers
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
      printWindow.onload = () => printWindow.print();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href); // Or specific file link
    // Ideally trigger a toast here
  };

  // Render Logic
  const renderContent = () => {
    if (isImage) {
      return (
        <div 
          className="relative transition-all duration-300 ease-out"
          style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
        >
          {isLoading && (
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="h-8 w-8 border-2 border-white/20 border-t-white animate-spin rounded-full" />
             </div>
          )}
          <img
            src={fileUrl}
            alt={file.name}
            onLoad={() => setIsLoading(false)}
            className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-md"
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-full max-w-5xl rounded-lg bg-white shadow-2xl"
          title={file.name}
        />
      );
    }

    if (isVideo) {
      return (
        <video
          src={fileUrl}
          controls
          autoPlay
          className="max-w-full max-h-[80vh] rounded-lg shadow-2xl outline-none"
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isAudio) {
      return (
        <div className="bg-slate-900 p-10 rounded-2xl shadow-2xl text-center border border-slate-800">
          <div className="w-40 h-40 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-inner">
            <FileIcon size={64} className="text-indigo-400" />
          </div>
          <h3 className="text-white text-xl font-medium mb-2">{file.name}</h3>
          <p className="text-slate-400 text-sm mb-6">{formatFileSize(file.size)}</p>
          <audio src={fileUrl} controls className="w-full min-w-[300px]" />
        </div>
      );
    }

    // Fallback
    return (
      <div className="text-center p-12 bg-slate-900 rounded-2xl border border-slate-800">
        <FileIcon size={80} className="text-slate-600 mx-auto mb-6" />
        <h3 className="text-white text-lg font-medium mb-2">No preview available</h3>
        <p className="text-slate-400 mb-6">This file type cannot be viewed directly.</p>
        <Button onClick={() => onDownload && onDownload(file)} variant="outline" className="text-slate-900 border-white/10 hover:bg-slate-100">
          <Download className="mr-2 h-4 w-4" /> Download File
        </Button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300 text-slate-200">
      
      {/* --- Top Toolbar --- */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-950/50">
        
        {/* Left: File Info */}
        <div className="flex items-center gap-4 min-w-0">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full">
            <X size={20} />
          </Button>
          <div className="flex items-center gap-3 min-w-0">
             <div className="p-1.5 bg-white/5 rounded-md hidden sm:block">
                <FileIcon size={16} className="text-indigo-400" />
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-md">{file.name}</span>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block">
                    {formatFileSize(file.size)} • {new Date(file.updatedAt).toLocaleDateString()}
                </span>
             </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Zoom Controls (Image Only) */}
          {isImage && (
            <div className="hidden md:flex items-center bg-white/5 rounded-lg p-1 mr-2 border border-white/5">
              <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 25} className="h-7 w-7 text-slate-400 hover:text-white">
                <ZoomOut size={14} />
              </Button>
              <span className="text-xs font-mono w-10 text-center text-slate-400">{zoom}%</span>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 300} className="h-7 w-7 text-slate-400 hover:text-white">
                <ZoomIn size={14} />
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
             {isImage && (
                <Button variant="ghost" size="icon" onClick={handleRotate} title="Rotate" className="text-slate-400 hover:text-white hover:bg-white/10">
                    <RotateCw size={18} />
                </Button>
             )}
             
             <Button variant="ghost" size="icon" onClick={handlePrint} title="Print" className="hidden sm:inline-flex text-slate-400 hover:text-white hover:bg-white/10">
                <Printer size={18} />
             </Button>

             <Button variant="ghost" size="icon" onClick={() => onDownload(file)} title="Download" className="text-slate-400 hover:text-white hover:bg-white/10">
                <Download size={18} />
             </Button>

             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowInfo(!showInfo)} 
                title="Info" 
                className={cn(
                    "transition-colors",
                    showInfo ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-slate-400 hover:text-white hover:bg-white/10"
                )}
             >
                <Info size={18} />
             </Button>
          </div>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto bg-transparent" onClick={() => setShowInfo(false)}>
          {renderContent()}
        </div>

        {/* --- Info Sidebar --- */}
        <div 
            className={cn(
                "absolute top-0 right-0 h-full w-80 bg-slate-900 border-l border-white/10 transform transition-transform duration-300 ease-in-out z-20 overflow-y-auto",
                showInfo ? "translate-x-0" : "translate-x-full"
            )}
        >
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-lg font-medium text-white mb-1">Details</h3>
                    <p className="text-sm text-slate-500">Metadata and properties</p>
                </div>

                <div className="space-y-6">
                    <InfoRow label="File Name" value={file.name} />
                    <InfoRow label="Type" value={file.mimeType || 'Unknown'} />
                    <InfoRow label="Size" value={formatFileSize(file.size)} />
                    <InfoRow label="Location" value={file.path || '/'} fontMono />
                    <InfoRow 
                        label="Created" 
                        value={new Date(file.createdAt).toLocaleString()} 
                    />
                    <InfoRow 
                        label="Modified" 
                        value={new Date(file.updatedAt).toLocaleString()} 
                    />
                </div>

                <div className="pt-6 border-t border-white/10">
                    <Button className="w-full bg-white text-slate-950 hover:bg-slate-200" onClick={() => onDownload(file)}>
                        <Download className="mr-2 h-4 w-4" /> Download File
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Subcomponent
const InfoRow = ({ label, value, fontMono }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
        <div className={cn("text-sm text-slate-300 break-words", fontMono && "font-mono text-xs bg-white/5 p-2 rounded")}>
            {value}
        </div>
    </div>
);

export default FileViewer;