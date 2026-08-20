import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight, Calendar, Sparkles, User } from 'lucide-react';

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
    if (Math.abs(diff) > 40) {
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
        className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-3 sm:p-6 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onClose}
      >
        {/* Top Header Bar */}
        <div 
          className="w-full max-w-6xl flex items-center justify-between z-20 pb-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-0.5">
            <div className="flex items-center space-x-1.5 text-white/90">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-xs sm:text-sm text-white font-heading truncate max-w-[170px] sm:max-w-xs">
                {photo.name}
              </span>
            </div>
            {photo.uploaderName && (
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-300 font-medium w-fit">
                <User className="w-3 h-3 text-amber-400" />
                <span>By {photo.uploaderName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={photo.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={photo.name}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-2.5 transition-all"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Viewer Area */}
        <div className="relative w-full flex-grow flex items-center justify-center max-w-6xl mx-auto overflow-hidden">
          {hasPrev && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-1 sm:left-4 z-20 p-3 sm:p-4 rounded-full bg-stone-900/80 hover:bg-amber-500 text-white transition-all -translate-y-1/2 top-1/2 backdrop-blur-md border border-white/10 shadow-xl"
              title="Previous (Left arrow)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.button>
          )}

          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative flex flex-col items-center justify-center max-h-full max-w-full px-2 sm:px-14"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photo.publicUrl}
              alt={photo.name}
              className="max-h-[70vh] sm:max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl ring-1 ring-white/10"
            />
          </motion.div>

          {hasNext && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-1 sm:right-4 z-20 p-3 sm:p-4 rounded-full bg-stone-900/80 hover:bg-amber-500 text-white transition-all -translate-y-1/2 top-1/2 backdrop-blur-md border border-white/10 shadow-xl"
              title="Next (Right arrow)"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </motion.button>
          )}
        </div>

        {/* Bottom Details Bar */}
        <div 
          className="w-full max-w-2xl flex items-center justify-between text-xs sm:text-sm text-stone-400 pt-2 px-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>{new Date(photo.createdTime).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {photo.uploaderName && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1 text-amber-400">
                  <User className="w-3.5 h-3.5" />
                  <span>{photo.uploaderName}</span>
                </div>
              </>
            )}
          </div>

          <p className="sm:hidden text-stone-500 text-[11px]">← Swipe to browse →</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;


