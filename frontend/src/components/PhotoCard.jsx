import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, User } from 'lucide-react';

const PhotoCard = ({ photo, onClick, adminMode, onDelete, isSelectionMode, isSelected, onToggleSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-stone-900 rounded-2xl overflow-hidden border transition-all flex flex-col ${isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-white/10 hover:border-amber-400/50 shadow-md'}`}
    >
      {/* Photo Container */}
      <div 
        className="relative aspect-square overflow-hidden bg-stone-950 cursor-pointer"
        onClick={() => isSelectionMode ? onToggleSelect(photo.id) : onClick(photo)}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-800/80 animate-pulse"></div>
        )}

        <img 
          src={photo.publicUrl} 
          alt={photo.name} 
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-300 ${isSelected ? 'scale-105 opacity-80' : 'group-hover:scale-105 opacity-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Selection Indicator overlay */}
        {isSelectionMode && (
          <div className="absolute top-2 left-2 z-20">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-amber-500 border-amber-500' : 'bg-black/40 border-white/50 backdrop-blur-md'}`}>
              {isSelected && <svg className="w-3.5 h-3.5 text-stone-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </div>
          </div>
        )}

        {/* Uploader Name Pill Tag overlay on photo */}
        {photo.uploaderName && (
          <div className="absolute bottom-2 left-2 z-10 flex items-center space-x-1 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-amber-300 text-[10px] font-semibold shadow-md max-w-[85%]">
            <User className="w-2.5 h-2.5 text-amber-400 shrink-0" />
            <span className="truncate">{photo.uploaderName}</span>
          </div>
        )}

        {/* Action icons overlay top right on hover / tap */}
        {!isSelectionMode && (
          <div className="absolute top-2 right-2 flex items-center space-x-1.5 z-10">
            <a 
              href={photo.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={photo.name}
              className="p-2 rounded-xl bg-black/60 hover:bg-amber-500 text-white hover:text-stone-950 backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 shadow-sm"
              onClick={(e) => e.stopPropagation()}
              title="Download original"
            >
              <Download className="w-3.5 h-3.5" />
            </a>

            {adminMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(photo.id);
                }}
                className="p-2 rounded-xl bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 shadow-sm"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Clean Bottom Label */}
      <div className="px-3 py-2 bg-stone-900/95 flex items-center justify-between">
        <h3 className="text-xs font-medium text-stone-200 truncate pr-2" title={photo.name}>
          {photo.name}
        </h3>
        <span className="text-[10px] text-stone-500 shrink-0">
          {new Date(photo.createdTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </motion.div>
  );
};

export default PhotoCard;



