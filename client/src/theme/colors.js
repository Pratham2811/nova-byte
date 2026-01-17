/**
 * Color Constants
 * Extracted for easy reference and type safety
 */

export const colors = {
  // Primary
  PRIMARY_MAIN: '#4285f4',
  PRIMARY_DARK: '#1a73e8',
  PRIMARY_LIGHT: '#e8f0fe',
  
  // Gray
  GRAY_50: '#f8f9fa',
  GRAY_100: '#f1f3f4',
  GRAY_200: '#e8eaed',
  GRAY_300: '#dadce0',
  GRAY_400: '#bdc1c6',
  GRAY_500: '#9aa0a6',
  GRAY_700: '#5f6368',
  GRAY_800: '#3c4043',
  GRAY_900: '#202124',
  
  // Semantic
  SUCCESS: '#1e8e3e',
  WARNING: '#e37400',
  ERROR: '#d93025',
  INFO: '#1a73e8',
  
  // File Type Colors
  FILE_IMAGE: '#ea4335',      // Red
  FILE_VIDEO: '#fbbc04',      // Yellow
  FILE_AUDIO: '#34a853',      // Green
  FILE_DOCUMENT: '#4285f4',   // Blue
  FILE_PDF: '#d93025',        // Red
  FILE_ARCHIVE: '#9aa0a6',    // Gray
  FILE_CODE: '#5f6368',       // Dark gray
  FILE_DEFAULT: '#5f6368',    // Dark gray
  
  // Folder
  FOLDER_DEFAULT: '#5f6368',  // Gray
  FOLDER_SHARED: '#4285f4',   // Blue
};

/**
 * Get color for file type
 */
export const getFileTypeColor = (mimeType = '') => {
  if (!mimeType) return colors.FILE_DEFAULT;
  
  if (mimeType.startsWith('image/')) return colors.FILE_IMAGE;
  if (mimeType.startsWith('video/')) return colors.FILE_VIDEO;
  if (mimeType.startsWith('audio/')) return colors.FILE_AUDIO;
  if (mimeType.includes('pdf')) return colors.FILE_PDF;
  if (mimeType.startsWith('text/') || mimeType.includes('document')) return colors.FILE_DOCUMENT;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return colors.FILE_ARCHIVE;
  if (mimeType.includes('javascript') || mimeType.includes('python') || mimeType.includes('java')) return colors.FILE_CODE;
  
  return colors.FILE_DEFAULT;
};

export default colors;
