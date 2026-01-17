import React from 'react';
import { FolderOpen, FileX } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Empty State Component
 * 
 * @param {Object} props
 * @param {'folder'|'file'|'search'} props.type - Type of empty state
 * @param {string} props.message - Custom message
 * @param {string} props.description - Additional description
 * @param {Object} props.action - Optional action button config
 * @param {string} props.action.label - Action button label
 * @param {Function} props.action.onClick - Action button click handler
 * @param {React.ReactNode} props.action.icon - Action button icon
 */
export const EmptyState = ({ type = 'folder', message, description, action }) => {
  const config = {
    folder: {
      icon: <FolderOpen size={48} className="text-gray-300" />,
      defaultMessage: 'This folder is empty',
      defaultDescription: 'Upload files or create new folders to get started',
    },
    file: {
      icon: <FileX size={48} className="text-gray-300" />,
      defaultMessage: 'No files found',
      defaultDescription: 'Try uploading some files',
    },
    search: {
      icon: <FileX size={48} className="text-gray-300" />,
      defaultMessage: 'No results found',
      defaultDescription: 'Try adjusting your search or filters',
    },
  };

  const { icon, defaultMessage, defaultDescription } = config[type] || config.folder;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-4 p-4 rounded-full bg-gray-50">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        {message || defaultMessage}
      </h3>
      <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
        {description || defaultDescription}
      </p>
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
          icon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
