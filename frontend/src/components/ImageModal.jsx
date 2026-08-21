import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight, Calendar, Sparkles, User, Trash2 } from 'lucide-react';

const ImageModal = ({ photo, onClose, onNext, onPrev, hasNext, hasPrev, onDelete }) => {
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    document.addEventListener('keydown', handleKeyDown);
    // Lock scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    // Only trigger swipe if horizontal swipe is dominant
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
      if (diffX > 0 && hasNext) onNext();
      if (diffX < 0 && hasPrev) onPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/96 backdrop-blur-xl"
        style={{ height: '100svh' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={onClose}
      >
        {/* Top Header Bar */}
        <div
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2.5 sm:px-6 sm:py-4 bg-gradient-to-b from-black/80 to-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-0.5 min-w-0 mr-2">
            <div className="flex items-center space-x-1.5 text-white/90 min-w-0">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold text-xs sm:text-sm text-white font-heading truncate max-w-[140px] sm:max-w-xs">
                {photo.name}
              </span>
            </div>
            {photo.uploaderName && (
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-300 font-medium w-fit shrink-0">
                <User className="w-3 h-3 text-amber-400" />
                <span>By {photo.uploaderName}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={photo.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={photo.name}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  onDelete(photo.id);
                }}
                className="flex items-center space-x-1.5 bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all active:scale-95 border border-red-500/30"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 sm:p-2.5 transition-all"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Image — fills the whole modal, centred ── */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            key={photo.id}
            src={photo.publicUrl}
            alt={photo.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="rounded-xl sm:rounded-2xl shadow-2xl ring-1 ring-white/10 object-contain select-none"
            style={{
              maxWidth: 'calc(100% - 5rem)',   /* leave room for nav arrows */
              maxHeight: 'calc(100svh - 8rem)', /* leave room for header + footer */
            }}
            draggable={false}
          />
        </div>

        {/* Prev Arrow */}
        {hasPrev && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-stone-900/80 hover:bg-amber-500 text-white transition-all backdrop-blur-md border border-white/10 shadow-xl"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </motion.button>
        )}

        {/* Next Arrow */}
        {hasNext && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-3 sm:p-4 rounded-full bg-stone-900/80 hover:bg-amber-500 text-white transition-all backdrop-blur-md border border-white/10 shadow-xl"
            title="Next"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </motion.button>
        )}

        {/* Bottom Details Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-t from-black/80 to-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-3 text-xs text-stone-400">
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
          <p className="sm:hidden text-stone-500 text-[11px]">← Swipe →</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
