import React from 'react';
import { FolderOpen, Search, FileQuestion, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

/**
 * Empty State Component
 * Renders a premium placeholder when no content is available.
 */
export const EmptyState = ({ type = 'folder', message, description, action }) => {
  
  const config = {
    folder: {
      icon: FolderOpen,
      defaultMessage: 'This folder is empty',
      defaultDescription: 'Upload files or create a new folder to get started organizing your content.',
    },
    file: {
      icon: FileQuestion,
      defaultMessage: 'No files found',
      defaultDescription: 'It looks like you haven’t uploaded any files here yet.',
    },
    search: {
      icon: Search,
      defaultMessage: 'No results found',
      defaultDescription: 'We couldn’t find what you searched for. Try adjusting your keywords or filters.',
    },
  };

  const { icon: Icon, defaultMessage, defaultDescription } = config[type] || config.folder;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      
      {/* Icon Container */}
      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-indigo-100 rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm">
          <Icon className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-md space-y-2 mb-8">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          {message || defaultMessage}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {description || defaultDescription}
        </p>
      </div>

      {/* Action Button */}
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-500/10 h-10 px-6 rounded-lg transition-all active:scale-95"
        >
          {action.icon ? (
            <span className="mr-2">{action.icon}</span>
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;