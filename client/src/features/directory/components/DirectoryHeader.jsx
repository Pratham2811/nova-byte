import React from 'react';
import { Grid, List, FolderPlus, Upload, Search, Plus } from 'lucide-react';
import { Breadcrumb } from './Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VIEW_MODES } from '../constants/directory.constants';
import { useDirectoryContext } from '../context/DirectoryContext';
import { Separator } from '@/components/ui/separator';

/**
 * Directory Header Component
 */
export const DirectoryHeader = () => {
  const {
    currentDirectoryId,
    viewMode,
    setViewMode,
    setSearchQuery,
    openModal,
  } = useDirectoryContext();

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between max-w-[1600px] mx-auto">
        
        {/* Left: Breadcrumbs */}
        <div className="flex-1 min-w-0">
           <Breadcrumb path={currentDirectoryId} />
        </div>

        {/* Right: Actions Toolbar */}
        <div className="flex items-center gap-3">
          
          {/* Search Input */}
          <div className="relative group w-full md:w-64 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Search..." 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all rounded-md text-sm"
            />
          </div>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          {/* View Toggle (Segmented Control style) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              onClick={() => setViewMode(VIEW_MODES.GRID)}
              className={`p-1.5 rounded-sm transition-all ${
                viewMode === VIEW_MODES.GRID 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode(VIEW_MODES.LIST)}
              className={`p-1.5 rounded-sm transition-all ${
                viewMode === VIEW_MODES.LIST 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => openModal('createFolder')}
              className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <FolderPlus className="mr-2 h-4 w-4 text-slate-500" />
              <span className="hidden sm:inline">Folder</span>
            </Button>
            
            <Button 
              size="sm" 
              onClick={() => openModal('upload')}
              className="h-9 bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DirectoryHeader;