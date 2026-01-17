import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
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
  if (!file) return null;

  const FileIcon = getFileIcon(file.mimeType || file.type);
  const isImage = file.mimeType?.startsWith('image/');
  const isPDF = file.mimeType === 'application/pdf';
  const isVideo = file.mimeType?.startsWith('video/');
  const isAudio = file.mimeType?.startsWith('audio/');

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4">
          <img
            src={file.url || file.path}
            alt={file.name}
            className="max-w-full max-h-[60vh] object-contain rounded"
          />
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className="w-full h-[60vh] bg-gray-50 rounded-lg">
          <iframe
            src={file.url || file.path}
            className="w-full h-full rounded-lg"
            title={file.name}
          />
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4">
          <video
            src={file.url || file.path}
            controls
            className="max-w-full max-h-[60vh] rounded"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    if (isAudio) {
      return (
        <div className="flex justify-center items-center bg-gray-50 rounded-lg p-8">
          <audio src={file.url || file.path} controls className="w-full max-w-md">
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }

    // Default: Show icon and file info
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
        <FileIcon size={64} className="text-gray-400 mb-4" />
        <p className="text-sm text-gray-600">Preview not available for this file type</p>
        <p className="text-xs text-gray-500 mt-1">Click download to view the file</p>
      </div>
    );
  };

  const footer = (
    <>
      {onDownload && (
        <Button
          variant="secondary"
          onClick={() => onDownload(file)}
          icon={<Download size={16} />}
        >
          Download
        </Button>
      )}
      {file.url && (
        <Button
          variant="text"
          onClick={() => window.open(file.url, '_blank')}
          icon={<ExternalLink size={16} />}
        >
          Open in New Tab
        </Button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={file.name}
      footer={footer}
      size="2xl"
    >
      {renderPreview()}
    </Modal>
  );
};

export default FileViewer;
