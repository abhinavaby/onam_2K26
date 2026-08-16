import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageModal = ({ photo, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center max-w-6xl mx-auto">
          {hasPrev && (
            <button 
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all transform -transtone-y-1/2 top-1/2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <motion.div 
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex flex-col items-center justify-center max-h-full max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={photo.publicUrl} 
              alt={photo.name}
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl px-4">
              <div className="text-white text-center sm:text-left mb-4 sm:mb-0">
                <p className="font-semibold text-lg truncate max-w-[250px] sm:max-w-[400px]">{photo.name}</p>
                <p className="text-white/60 text-sm">{new Date(photo.createdTime).toLocaleDateString()}</p>
              </div>
              <a 
                href={photo.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={photo.name}
                className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-full font-medium transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                <span>Download Original</span>
              </a>
            </div>
          </motion.div>

          {hasNext && (
            <button 
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-all transform -transtone-y-1/2 top-1/2"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
