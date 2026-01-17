/**
 * Directory Feature Constants
 */

import { Folder, FolderOpen } from 'lucide-react';

/**
 * View modes
 */
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
};

/**
 * Sort options
 */
export const SORT_OPTIONS = {
  NAME_ASC: { value: 'name-asc', label: 'Name (A-Z)' },
  NAME_DESC: { value: 'name-desc', label: 'Name (Z-A)' },
  DATE_ASC: { value: 'date-asc', label: 'Oldest First' },
  DATE_DESC: { value: 'date-desc', label: 'Newest First' },
  SIZE_ASC: { value: 'size-asc', label: 'Smallest First' },
  SIZE_DESC: { value: 'size-desc', label: 'Largest First' },
};

/**
 * Folder icons
 */
export const FOLDER_ICONS = {
  DEFAULT: Folder,
  OPEN: FolderOpen,
};

/**
 * Get folder icon
 */
export const getFolderIcon = (isOpen = false) => {
  return isOpen ? FOLDER_ICONS.OPEN : FOLDER_ICONS.DEFAULT;
};

export default {
  VIEW_MODES,
  SORT_OPTIONS,
  FOLDER_ICONS,
  getFolderIcon,
};
