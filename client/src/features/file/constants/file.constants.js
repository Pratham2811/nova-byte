/**
 * File Feature Constants
 */

import { FileText, FileImage, FileVideo, FileAudio, FileArchive, FileCode, File } from 'lucide-react';

/**
 * File type icon mapping
 */
export const FILE_TYPE_ICONS = {
  // Images
  'image/jpeg': FileImage,
  'image/jpg': FileImage,
  'image/png': FileImage,
  'image/gif': FileImage,
  'image/svg+xml': FileImage,
  'image/webp': FileImage,
  
  // Videos
  'video/mp4': FileVideo,
  'video/mpeg': FileVideo,
  'video/webm': FileVideo,
  'video/quicktime': FileVideo,
  
  // Audio
  'audio/mpeg': FileAudio,
  'audio/mp3': FileAudio,
  'audio/wav': FileAudio,
  'audio/ogg': FileAudio,
  
  // Documents
'text/plain': FileText,
  'application/pdf': FileText,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  
  // Archives
  'application/zip': FileArchive,
  'application/x-rar-compressed': FileArchive,
  'application/x-tar': FileArchive,
  'application/gzip': FileArchive,
  
  // Code
  'text/javascript': FileCode,
  'text/html': FileCode,
  'text/css': FileCode,
  'application/json': FileCode,
  'application/xml': FileCode,
};

/**
 * Get icon component for file type
 */
export const getFileIcon = (mimeType) => {
  if (!mimeType) return File;
  
  // Check exact match
  if (FILE_TYPE_ICONS[mimeType]) {
    return FILE_TYPE_ICONS[mimeType];
  }
  
  // Check by category
  if (mimeType.startsWith('image/')) return FileImage;
  if (mimeType.startsWith('video/')) return FileVideo;
  if (mimeType.startsWith('audio/')) return FileAudio;
  if (mimeType.startsWith('text/')) return FileText;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return FileArchive;
  
  return File;
};

/**
 * File size limits
 */
export const FILE_SIZE_LIMITS = {
  MAX_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_SIZE_LABEL: '100MB',
};

/**
 * Supported file types (for upload validation)
 */
export const SUPPORTED_FILE_TYPES = [
  // Images
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
  // Videos
  'video/mp4', 'video/mpeg', 'video/webm', 'video/quicktime',
  // Audio
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
  // Documents
  'text/plain', 'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Archives
  'application/zip', 'application/x-rar-compressed', 'application/x-tar', 'application/gzip',
  // Code
  'text/javascript', 'text/html', 'text/css', 'application/json', 'application/xml',
];

/**
 * File actions
 */
export const FILE_ACTIONS = {
  VIEW: 'view',
  DOWNLOAD: 'download',
  RENAME: 'rename',
  DELETE: 'delete',
  SHARE: 'share',
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format date
 */
export const formatFileDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};
