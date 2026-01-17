import React from 'react';
import { Grid, List } from 'lucide-react';
import { FolderPlus, Upload, Search, SortAsc } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb.jsx';
import { Button, IconButton } from '@/shared/components';
import { VIEW_MODES } from '../constants/directory.constants.js';

/**
 * Directory Header Component
 * Header with breadcrumb, view toggle, and action buttons
 * 
 * @param {Object} props
 * @param {string} props.directoryPath - Current directory path
 * @param {Function} props.onNavigate - Navigate to path handler
 * @param {'grid'|'list'} props.viewMode - Current view mode
 * @param {Function} props.onViewModeChange - View mode change handler
 * @param {Function} props.onCreateFolder - Create folder handler
 * @param {Function} props.onUpload - Upload file handler
 * @param {Function} props.onSearch - Search handler (optional)
 */
export const DirectoryHeader = ({
  directoryPath,
  onNavigate,
  viewMode,
  onViewModeChange,
  onCreateFolder,
  onUpload,
  onSearch,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
      {/* Top row: Breadcrumb and view toggle */}
      <div className="flex items-center justify-between mb-3">
        <Breadcrumb path={directoryPath} onNavigate={onNavigate} />
        
        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <IconButton
            icon={<Grid size={16} />}
            onClick={() => onViewModeChange(VIEW_MODES.GRID)}
            size="small"
            className={`${
              viewMode === VIEW_MODES.GRID
                ? 'bg-white shadow-sm'
                : 'bg-transparent hover:bg-gray-200'
            }`}
            tooltip="Grid view"
          />
          <IconButton
            icon={<List size={16} />}
            onClick={() => onViewModeChange(VIEW_MODES.LIST)}
            size="small"
            className={`${
              viewMode === VIEW_MODES.LIST
                ? 'bg-white shadow-sm'
                : 'bg-transparent hover:bg-gray-200'
            }`}
            tooltip="List view"
          />
        </div>
      </div>

      {/* Bottom row: Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          onClick={onCreateFolder}
          icon={<FolderPlus size={16} />}
          size="sm"
        >
          <span className="hidden sm:inline">New Folder</span>
        </Button>
        
        <Button
          variant="secondary"
          onClick={onUpload}
          icon={<Upload size={16} />}
          size="sm"
        >
          <span className="hidden sm:inline">Upload</span>
        </Button>

        {/* Search (optional) */}
        {onSearch && (
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files and folders..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryHeader;
