import React, { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const FolderCreate = ({
  onClose,
  onCreate,
  directoryPath,
  loading = false,
}) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    if (folderName.length > 255) {
      setError('Folder name is too long');
      return;
    }

    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(folderName)) {
      setError('Folder name contains invalid characters');
      return;
    }

    await onCreate(folderName.trim(), directoryPath);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleCreate();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white p-0 gap-0 overflow-hidden border-slate-100 shadow-xl">
        
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FolderPlus size={20} />
            </div>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              New Folder
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500">
            Create a new directory to organize your files.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folderName" className="text-sm font-medium text-slate-700">
              Name
            </Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyPress}
              placeholder="e.g., Projects"
              autoFocus
              className={`
                h-10 bg-slate-50 border-slate-200 
                focus:bg-white focus:border-indigo-500 focus:ring-indigo-500/20 
                placeholder:text-slate-400
                ${error ? 'border-red-500 focus:ring-red-500/20' : ''}
              `}
              disabled={loading}
            />
            
            {/* Validation / Helper Text */}
            {error ? (
              <p className="text-xs text-red-500 animate-in slide-in-from-top-1">
                {error}
              </p>
            ) : directoryPath ? (
              <p className="text-[11px] text-slate-400 font-mono truncate">
                Location: /{directoryPath}
              </p>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex-row gap-2 justify-end mt-4">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={loading}
            className="text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!folderName.trim() || loading}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20"
          >
            {loading ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default FolderCreate;