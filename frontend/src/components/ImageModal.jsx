import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageModal = ({ photo, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  const touchStartX = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && hasNext) onNext();
      if (diff < 0 && hasPrev) onPrev();
    }
    touchStartX.current = null;
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 sm:p-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2.5 transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full flex items-center justify-center max-w-6xl mx-auto">
          {hasPrev && (
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-1 sm:left-4 z-10 p-3 sm:p-3 rounded-full bg-black/50 hover:bg-amber-500/80 text-white transition-all -translate-y-1/2 top-1/2 backdrop-blur-sm border border-white/10"
            >
              <ChevronLeft className="w-7 h-7" />
            </motion.button>
          )}

          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex flex-col items-center justify-center max-h-full max-w-full px-10 sm:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photo.publicUrl}
              alt={photo.name}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full max-w-2xl px-2 gap-3">
              <div className="text-white text-center sm:text-left">
                <p className="font-semibold text-base truncate max-w-[200px] sm:max-w-[400px]">{photo.name}</p>
                <p className="text-white/60 text-sm">{new Date(photo.createdTime).toLocaleDateString()}</p>
              </div>
              <a
                href={photo.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={photo.name}
                className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-full font-medium transition-all hover:scale-105 text-sm whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </div>

            {/* Mobile swipe hint */}
            <p className="sm:hidden text-white/30 text-xs mt-3">← Swipe to navigate →</p>
          </motion.div>

          {hasNext && (
            <motion.button
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-1 sm:right-4 z-10 p-3 sm:p-3 rounded-full bg-black/50 hover:bg-amber-500/80 text-white transition-all -translate-y-1/2 top-1/2 backdrop-blur-sm border border-white/10"
            >
              <ChevronRight className="w-7 h-7" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;

