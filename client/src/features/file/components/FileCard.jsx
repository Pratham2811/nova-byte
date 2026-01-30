import React from 'react';
import { Download, ExternalLink, Edit, Trash } from 'lucide-react';
import { Card, IconButton } from '@/shared/components';
import { getFileIcon, formatFileSize, formatFileDate } from '../constants/file.constants';
import { getFileTypeColor } from '@/theme';
import { useDirectoryContext } from '@/features/directory/context/DirectoryContext.jsx';

/**
 * File Card Component
 * Consumes context directly for actions - NO PROP DRILLING!
 * Only receives file data as prop (necessary for mapping)
 * 
 * @param {Object} props
 * @param {Object} props.file - File object (required for rendering)
 */
export const FileCard = ({ file }) => {
  const {
    viewMode,
    openFileViewer,
    openRename,
    openDelete,
    onDownload,
  } = useDirectoryContext();

  const FileIcon = getFileIcon(file.mimeType || file.type);
  const iconColor = getFileTypeColor(file.mimeType || file.type);

  const handleView = () => {
    openFileViewer(file);
  };

  const handleDownload = (e) => {
    e?.stopPropagation();
    onDownload(file);
  };

  const handleRename = (e) => {
    e?.stopPropagation();
    openRename(file, 'file');
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    openDelete(file, 'file');
  };

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
        {/* Icon */}
        <div className="flex-shrink-0">
          <FileIcon size={24} style={{ color: iconColor }} />
        </div>

        {/* File name - clickable */}
        <button
          onClick={handleView}
          className="flex-1 text-left truncate hover:text-blue-600 transition-colors"
        >
          <span className="text-sm font-medium text-gray-900">{file.name}</span>
        </button>

        {/* File size */}
        <div className="hidden sm:block text-sm text-gray-500 w-20 text-right">
          {formatFileSize(file.size)}
        </div>

        {/* Modified date */}
        <div className="hidden md:block text-sm text-gray-500 w-32 text-right">
          {formatFileDate(file.updatedAt || file.createdAt)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            icon={<ExternalLink size={16} />}
            onClick={handleView}
            tooltip="View"
            size="small"
          />
          <IconButton
            icon={<Download size={16} />}
            onClick={handleDownload}
            tooltip="Download"
            size="small"
          />
          <IconButton
            icon={<Edit size={16} />}
            onClick={handleRename}
            tooltip="Rename"
            size="small"
          />
          <IconButton
            icon={<Trash size={16} />}
            onClick={handleDelete}
            tooltip="Delete"
            size="small"
            className="hover:bg-red-50 hover:text-red-600"
          />
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <Card className="group relative">
      {/* File content area - clickable */}
      <button
        onClick={handleView}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        {/* Icon */}
        <div className="flex justify-center items-center py-6 mb-3">
          <FileIcon size={48} style={{ color: iconColor }} />
        </div>

        {/* File name */}
        <h3 className="text-sm font-medium text-gray-900 truncate mb-1" title={file.name}>
          {file.name}
        </h3>

        {/* File meta */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(file.size)}</span>
          <span className="hidden sm:inline">{formatFileDate(file.updatedAt || file.createdAt)}</span>
        </div>
      </button>

      {/* Action buttons - shown on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <IconButton
          icon={<Download size={14} />}
          onClick={handleDownload}
          tooltip="Download"
          size="small"
          className="bg-white shadow-sm"
        />
        <IconButton
          icon={<Edit size={14} />}
          onClick={handleRename}
          tooltip="Rename"
          size="small"
          className="bg-white shadow-sm"
        />
        <IconButton
          icon={<Trash size={14} />}
          onClick={handleDelete}
          tooltip="Delete"
          size="small"
          className="bg-white shadow-sm hover:bg-red-50 hover:text-red-600"
        />
      </div>
    </Card>
  );
};

export default FileCard;
