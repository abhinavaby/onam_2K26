import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  UploadCloud, 
  X, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  FolderOpen, 
  Trash2, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadPhotos } from '../services/api';

const UploadZone = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [uploadedCount, setUploadedCount] = useState(0);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const validateFiles = (newFiles) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 15 * 1024 * 1024; // 15MB
    let validFiles = [];
    let errorMessage = '';

    Array.from(newFiles).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errorMessage = `File "${file.name}" is not a supported format (JPG, PNG, WEBP).`;
      } else if (file.size > maxSize) {
        errorMessage = `File "${file.name}" exceeds 15MB.`;
      } else {
        validFiles.push(Object.assign(file, {
          preview: URL.createObjectURL(file)
        }));
      }
    });

    if (errorMessage) {
      setStatus({ type: 'error', message: errorMessage });
    }
    return validFiles;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const validFiles = validateFiles(e.dataTransfer.files);
      setFiles(prev => [...prev, ...validFiles]);
      setStatus({ type: '', message: '' });
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const validFiles = validateFiles(e.target.files);
      setFiles(prev => [...prev, ...validFiles]);
      setStatus({ type: '', message: '' });
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const clearAllFiles = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setProgress(15);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    try {
      setProgress(45);
      const res = await uploadPhotos(formData);
      setProgress(100);
      
      if (res.data.success) {
        const count = files.length;
        setUploadedCount(count);
        setStatus({ 
          type: 'success', 
          message: `${count} ${count === 1 ? 'photo' : 'photos'} uploaded securely to Google Drive!` 
        });
        files.forEach(file => URL.revokeObjectURL(file.preview));
        setFiles([]);
      }
    } catch (error) {
      setProgress(0);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Upload failed. Please check your internet connection and try again.' 
      });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 800);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Upload Box Container */}
      <div 
        className={`relative border border-dashed rounded-3xl p-8 sm:p-12 transition-all duration-200 flex flex-col items-center justify-center text-center overflow-hidden
          ${dragActive 
            ? 'border-amber-400 bg-amber-500/10' 
            : 'border-white/15 bg-stone-900/60 hover:border-amber-400/50 hover:bg-stone-900/90'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp"
          onChange={handleChange}
          className="hidden"
        />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
          className="hidden"
        />
        
        {/* Clean Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
          <UploadCloud className="w-7 h-7" />
        </div>
        
        <h3 className="text-base sm:text-lg font-bold text-white mb-1">
          Drop photos here
        </h3>
        
        <p className="text-stone-400 text-xs mb-6">
          JPG, PNG, or WEBP up to 15MB
        </p>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Browse Library</span>
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all flex items-center justify-center space-x-2"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span>Camera</span>
          </button>
        </div>
      </div>

      {/* Status Alert Notification */}
      <AnimatePresence>
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl
              ${status.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/80 text-red-300 border border-red-500/40'}
            `}
          >
            <div className="flex items-center space-x-3">
              {status.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
              )}
              <p className="font-semibold text-sm sm:text-base">{status.message}</p>
            </div>

            {status.type === 'success' && (
              <Link
                to="/gallery"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold shadow-md transition-all self-start sm:self-auto"
              >
                <span>View in Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected File Previews */}
      {files.length > 0 && (
        <div className="mt-10 p-6 rounded-3xl bg-[#11131d] border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <h4 className="text-base font-bold text-white flex items-center font-heading">
              <FileImage className="w-4 h-4 mr-2 text-amber-400"/>
              Selected for Upload ({files.length})
            </h4>

            <button
              type="button"
              onClick={clearAllFiles}
              disabled={uploading}
              className="text-xs text-stone-400 hover:text-red-400 font-semibold flex items-center space-x-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>

          {/* Thumbnails Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-h-96 overflow-y-auto pr-1">
            <AnimatePresence>
              {files.map((file, idx) => (
                <motion.div
                  key={file.name + idx}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="relative group rounded-2xl overflow-hidden shadow-md border border-white/10 aspect-square bg-stone-900"
                >
                  <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                  
                  {/* File info overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-2">
                    <button 
                      onClick={() => removeFile(idx)}
                      className="self-end p-1.5 bg-black/60 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors"
                      disabled={uploading}
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    
                    <div>
                      <p className="text-white text-[11px] font-medium truncate drop-shadow">
                        {file.name}
                      </p>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Upload Button or Progress Bar */}
          <div className="mt-8 flex flex-col items-center">
            {uploading ? (
              <div className="w-full max-w-md">
                <div className="flex justify-between text-xs font-bold text-stone-300 mb-2">
                  <span>Uploading to Google Drive...</span>
                  <span className="text-amber-400">{progress}%</span>
                </div>
                <div className="w-full bg-stone-900 rounded-full h-3 overflow-hidden p-0.5 border border-white/10">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-300 shadow-sm" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUpload}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-stone-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Upload {files.length} {files.length === 1 ? 'Memory' : 'Memories'} Now</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;


