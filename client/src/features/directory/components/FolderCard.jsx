import React from 'react';
import { Folder, Edit, Trash } from 'lucide-react';
import { Card, IconButton } from '@/shared/components';
import { useDirectoryContext } from '../context/DirectoryContext.jsx';

/**
 * Folder Card Component
 * Consumes context directly for actions - NO PROP DRILLING!
 * Only receives folder data as prop (necessary for mapping)
 * 
 * @param {Object} props
 * @param {Object} props.folder - Folder object (required for rendering)
 */
export const FolderCard = ({ folder }) => {
  const {
    viewMode,
    handleFolderClick,
    openRename,
    openDelete,
  } = useDirectoryContext();

  const handleClick = (e) => {
    // Don't trigger folder open if clicking on action buttons
  
    handleFolderClick(folder);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    openRename(folder, 'folder');
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    openDelete(folder, 'folder');
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleClick}
        className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
      >
        {/* Folder Icon */}
        <div className="flex-shrink-0">
          <Folder size={24} className="text-blue-500" />
        </div>

        {/* Folder name */}
        <div className="flex-1 truncate">
          <span className="text-sm font-medium text-gray-900">{folder.name}</span>
        </div>

        {/* Item count (if available) */}
        {folder.itemCount !== undefined && (
          <div className="hidden md:block text-sm text-gray-500 w-24 text-right">
            {folder.itemCount} items
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
    <Card
      onClick={handleClick}
      interactive
      className="group relative"
    >
      {/* Folder content area */}
      <div className="w-full">
        {/* Icon */}
        <div className="flex justify-center items-center py-6 mb-3">
          <Folder size={48} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
        </div>

        {/* Folder name */}
        <h3 className="text-sm font-medium text-gray-900 truncate mb-1" title={folder.name}>
          {folder.name}
        </h3>

        {/* Folder meta */}
        {folder.itemCount !== undefined && (
          <p className="text-xs text-gray-500">
            {folder.itemCount} item{folder.itemCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Action buttons - shown on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
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

export default FolderCard;
