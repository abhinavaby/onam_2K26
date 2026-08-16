import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2 } from 'lucide-react';

const PhotoCard = ({ photo, onClick, adminMode, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3 }}
      className="group relative bg-stone-900 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/50 shadow-md transition-all flex flex-col"
    >
      {/* Photo Container */}
      <div 
        className="relative aspect-square overflow-hidden bg-stone-950 cursor-pointer"
        onClick={() => onClick(photo)}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-800/80 animate-pulse"></div>
        )}

        <img 
          src={photo.publicUrl} 
          alt={photo.name} 
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Action icons overlay top right on hover / tap */}
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
      </div>
      
      {/* Clean Bottom Label */}
      <div className="px-3 py-2.5 bg-stone-900/90 flex items-center justify-between">
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



