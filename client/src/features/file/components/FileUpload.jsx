import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { Modal, Button, Input } from '@/shared/components';
import { FILE_SIZE_LIMITS } from '../constants/file.constants.js';
import { formatFileSize } from '../constants/file.constants.js';

/**
 * File Upload Component
 * Modal with drag-and-drop and file selection for uploading files
 * 
 * @param {Object} props
 * @param {Function} props.onClose - Close modal handler
 * @param {Function} props.onUpload - Upload handler
 * @param {string} props.directoryPath - Current directory path
 * @param {boolean} props.loading - Upload loading state
 */
export const FileUpload = ({
  onClose,
  onUpload,
  directoryPath,
  loading = false,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateFile = (file) => {
    return null;
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = [];
    const newErrors = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    await onUpload(selectedFiles, directoryPath);
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleUpload}
        disabled={selectedFiles.length === 0 || loading}
        icon={<Upload size={16} />}
      >
        {loading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Upload Files"
      footer={footer}
      size="lg"
      closeOnBackdrop={!loading}
    >
      <div className="space-y-4">
        {/* Drag and Drop Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
            ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-blue-400'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !loading && document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            disabled={loading}
          />
          
          <Upload size={48} className={`mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {dragActive ? 'Drop files here' : 'Drag and drop files here'}
          </p>
          <p className="text-xs text-gray-500">
            or click to browse (max {FILE_SIZE_LIMITS.MAX_SIZE_LABEL} per file)
          </p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-medium text-red-800 mb-1">Upload errors:</p>
            <ul className="text-xs text-red-600 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  {!loading && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FileUpload;
