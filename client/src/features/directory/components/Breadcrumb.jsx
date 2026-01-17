import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

/**
 * Breadcrumb Component
 * Shows directory path as clickable breadcrumbs
 * 
 * @param {Object} props
 * @param {string} props.path - Current directory path (e.g., "folder1/folder2")
 * @param {Function} props.onNavigate - Navigate handler (receives path segment)
 */
export const Breadcrumb = ({ path, onNavigate }) => {
  const segments = path ? path.split('/').filter(Boolean) : [];
 
  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      {/* Home */}
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
        aria-label="Go to root"
      >
        <Home size={16} />
        <span className="hidden sm:inline">Home</span>
      </button>

      {/* Path segments */}
      {segments.map((segment, index) => {
        const segmentPath = segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight size={16} className="text-gray-400" />
            <button
              onClick={() => !isLast && onNavigate(segmentPath)}
              className={`px-2 py-1 rounded transition-colors ${
                isLast
                  ? 'text-gray-900 font-medium cursor-default'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              disabled={isLast}
            >
              {segment}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
