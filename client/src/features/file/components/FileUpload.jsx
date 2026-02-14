import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CloudUpload } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FILE_SIZE_LIMITS, formatFileSize } from '../constants/file.constants';

export const FileUpload = ({
  onClose,
  onUpload,
  directoryPath,
  loading = false,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Validate file size and type if needed
  const validateFile = (file) => {
    if (file.size > FILE_SIZE_LIMITS.MAX_SIZE_BYTES) {
      return `Exceeds ${FILE_SIZE_LIMITS.MAX_SIZE_LABEL} limit`;
    }
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
        // Prevent duplicates
        if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
            validFiles.push(file);
        }
      }
    });

    if (newErrors.length > 0) setErrors(prev => [...prev, ...newErrors]);
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  // --- Drag & Drop Handlers ---
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
  }, [selectedFiles]);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input so same file can be selected again if removed
    e.target.value = null;
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    await onUpload(selectedFiles, directoryPath);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !loading && !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden bg-white shadow-xl border-slate-100">
        
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-50">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <CloudUpload size={20} />
             </div>
             <div>
                <DialogTitle className="text-xl font-semibold text-slate-900">Upload Files</DialogTitle>
                <DialogDescription className="text-slate-500 mt-1">
                    Add files to <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">/{directoryPath || 'root'}</span>
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
            {/* Drop Zone */}
            <div
                className={`
                    relative group flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed transition-all duration-200
                    ${dragActive 
                        ? 'border-indigo-500 bg-indigo-50/50' 
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                    }
                    ${loading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={loading}
                />
                
                <div className={`flex flex-col items-center gap-2 transition-transform duration-200 ${dragActive ? 'scale-105' : ''}`}>
                    <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100">
                        <Upload className={`w-6 h-6 ${dragActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-700">
                            <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Max size per file: {FILE_SIZE_LIMITS.MAX_SIZE_LABEL}
                        </p>
                    </div>
                </div>
            </div>

            {/* Error List */}
            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex gap-2 items-start animate-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-red-800">Some files could not be added:</p>
                        <ul className="text-xs text-red-600 list-disc list-inside">
                            {errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                    <button onClick={() => setErrors([])} className="ml-auto text-red-400 hover:text-red-600">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* File List */}
            {selectedFiles.length > 0 && (
                <div className="space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-700">Selected Files ({selectedFiles.length})</h4>
                        <button 
                            onClick={() => setSelectedFiles([])}
                            className="text-xs text-slate-400 hover:text-red-600 transition-colors"
                            disabled={loading}
                        >
                            Clear all
                        </button>
                    </div>
                    
                    <ScrollArea className="h-[180px] w-full rounded-lg border border-slate-200 bg-white">
                        <div className="p-1 space-y-1">
                            {selectedFiles.map((file, index) => (
                                <div key={`${file.name}-${index}`} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-md group transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2 bg-slate-100 rounded text-slate-500">
                                            <FileText size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    
                                    {!loading && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between sm:justify-between">
            <div className="text-xs text-slate-400">
                {selectedFiles.length > 0 && !loading && "Ready to upload"}
            </div>
            <div className="flex gap-2">
                <Button variant="ghost" onClick={onClose} disabled={loading} className="text-slate-500 hover:text-slate-900">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={selectedFiles.length === 0 || loading}
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20"
                >
                    {loading ? (
                        <>Uploading...</>
                    ) : (
                        <>Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}</>
                    )}
                </Button>
            </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
};

export default FileUpload;