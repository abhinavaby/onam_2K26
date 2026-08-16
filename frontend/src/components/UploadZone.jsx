import React, { useState, useRef } from 'react';
import { UploadCloud, X, FileImage, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadPhotos } from '../services/api';

const UploadZone = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: '', message: '' }); // type: 'success' | 'error'
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (newFiles) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    let validFiles = [];
    let errorMessage = '';

    Array.from(newFiles).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errorMessage = `File ${file.name} is not a supported format (JPG, PNG, WEBP).`;
      } else if (file.size > maxSize) {
        errorMessage = `File ${file.name} is larger than 10MB.`;
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

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setProgress(20);
    setStatus({ type: '', message: '' });

    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    try {
      setProgress(50);
      const res = await uploadPhotos(formData);
      setProgress(100);
      
      if (res.data.success) {
        setStatus({ type: 'success', message: 'Photos uploaded successfully to Google Drive!' });
        // Cleanup previews
        files.forEach(file => URL.revokeObjectURL(file.preview));
        setFiles([]);
      }
    } catch (error) {
      setProgress(0);
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Upload failed. Please try again.' 
      });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center overflow-hidden
          ${dragActive ? 'border-amber-500 bg-amber-50' : 'border-stone-300 bg-white hover:border-amber-400 hover:bg-stone-50'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6 text-amber-600">
          <UploadCloud className="w-10 h-10" />
        </div>
        
        <h3 className="text-2xl font-bold text-stone-800 mb-2">Drag & Drop your photos here</h3>
        <p className="text-stone-500 mb-8">JPG, PNG or WEBP, max 10MB per file</p>
        
        <button
          onClick={() => inputRef.current?.click()}
          className="px-6 py-2.5 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors focus:ring-4 focus:ring-stone-200 shadow-lg"
          disabled={uploading}
        >
          or Browse Files
        </button>
      </div>

      {/* Status Message */}
      <AnimatePresence>
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-6 p-4 rounded-xl flex items-center space-x-3
              ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}
            `}
          >
            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-medium">{status.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mt-10">
          <h4 className="text-lg font-semibold text-stone-800 mb-4 flex items-center">
            <FileImage className="w-5 h-5 mr-2 text-amber-500"/> Selected Files ({files.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {files.map((file, idx) => (
                <motion.div
                  key={file.name + idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group rounded-xl overflow-hidden shadow-sm border border-stone-200 aspect-square bg-stone-100"
                >
                  <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <button 
                      onClick={() => removeFile(idx)}
                      className="self-end p-1 bg-white/20 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors"
                      disabled={uploading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-white text-xs truncate max-w-full px-1 drop-shadow-md">
                      {file.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-col items-center">
            {uploading ? (
              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm text-stone-600 mb-1 font-medium">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2.5">
                  <div 
                    className="bg-amber-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleUpload}
                className="px-8 py-3 rounded-full bg-amber-600 text-white font-semibold shadow-lg hover:bg-amber-500 hover:shadow-xl transition-all transform hover:-transtone-y-0.5 flex items-center space-x-2"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Upload {files.length} {files.length === 1 ? 'Photo' : 'Photos'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
