import React from 'react';
import { Download, Pencil, Trash2, ExternalLink, FileText } from 'lucide-react';
import { getFileIcon, formatFileSize, formatFileDate } from '../constants/file.constants';
import { useDirectoryContext } from '@/features/directory/context/DirectoryContext';
import { getDownloadUrl } from '../services/file.service';
import { cn } from "@/lib/utils";

/**
 * File Card Component
 * Renders an individual file in List or Grid view.
 */
export const FileCard = ({ file, viewMode }) => {
  const { openModal } = useDirectoryContext();

  // Get dynamic icon based on file type
  const IconComponent = getFileIcon(file.mimeType || file.type) || FileText;
  
  // Handlers
  const handleView = (e) => {
    e?.preventDefault(); // Prevent bubbling if wrapped in link
    openModal('fileViewer', file, 'file');
  };

  const handleDownload = (e) => {
    e?.stopPropagation();
    // Assuming getDownloadUrl returns a full URL
    window.open(getDownloadUrl(file.id), '_blank');
  };

  const handleRename = (e) => {
    e?.stopPropagation();
    openModal('rename', file, 'file');
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    openModal('delete', file, 'file');
  };

  // --- List View ---
  if (viewMode === 'list') {
    return (
      <div 
        onClick={handleView}
        className="group flex items-center gap-3 px-4 py-3 bg-white border border-transparent hover:border-slate-200 hover:bg-slate-50 rounded-lg transition-all duration-200 cursor-pointer"
      >
        {/* Icon & Name (Flex-1) */}
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 p-2 bg-slate-100 rounded text-slate-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
            <IconComponent size={20} />
          </div>
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 truncate">
            {file.name}
          </span>
        </div>

        {/* Date (Fixed Width - matches FileList header) */}
        <div className="w-32 hidden md:block text-left text-xs text-slate-400">
           {formatFileDate(file.updatedAt || file.createdAt)}
        </div>

        {/* Size (Fixed Width - matches FileList header) */}
        <div className="w-24 hidden sm:block text-right text-xs text-slate-400 font-mono">
          {formatFileSize(file.size)}
        </div>

        {/* Actions (Fixed Width) */}
        <div className="w-16 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <ActionBtn onClick={handleDownload} icon={Download} title="Download" />
          <ActionBtn onClick={handleRename} icon={Pencil} title="Rename" />
          <ActionBtn onClick={handleDelete} icon={Trash2} title="Delete" variant="danger" />
        </div>
      </div>
    );
  }

  // --- Grid View ---
  return (
    <div 
      onClick={handleView}
      className="group relative flex flex-col justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer h-48"
    >
      {/* Top: Actions Overlay */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-sm border border-slate-100">
         <ActionBtn onClick={handleDownload} icon={Download} title="Download" size="xs" />
         <ActionBtn onClick={handleRename} icon={Pencil} title="Rename" size="xs" />
         <ActionBtn onClick={handleDelete} icon={Trash2} title="Delete" variant="danger" size="xs" />
      </div>

      {/* Center: Icon Preview */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="text-slate-400 group-hover:scale-110 group-hover:text-indigo-500 transition-all duration-300">
           <IconComponent size={48} strokeWidth={1.5} />
        </div>
      </div>

      {/* Bottom: Info */}
      <div className="w-full space-y-1">
        <h3 className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors" title={file.name}>
          {file.name}
        </h3>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wide">
          <span>{formatFileSize(file.size)}</span>
          {/* Only show extension/type if space permits, simplified for now */}
          <span className="truncate max-w-[50px]">{file.mimeType?.split('/')[1] || 'FILE'}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper: Tiny Action Button
 */
const ActionBtn = ({ onClick, icon: Icon, title, variant = "default", size = "sm" }) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      "flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
      size === "sm" ? "p-1.5" : "p-1",
      variant === "danger" 
        ? "text-slate-400 hover:text-red-600 hover:bg-red-50" 
        : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
    )}
  >
    <Icon size={size === "sm" ? 14 : 12} />
  </button>
);

export default FileCard;