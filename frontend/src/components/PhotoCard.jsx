import React from 'react';
import { motion } from 'framer-motion';
import { Download, Maximize2, Trash2 } from 'lucide-react';

const PhotoCard = ({ photo, onClick, adminMode, onDelete }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full"
    >
      <div 
        className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => onClick(photo)}
      >
        <img 
          src={photo.publicUrl} 
          alt={photo.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Hover overlay - desktop only */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 hidden sm:flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 flex flex-col items-center gap-1 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
            <div className="bg-white/90 text-stone-900 p-3 rounded-full shadow-lg">
              <Maximize2 className="w-5 h-5" />
            </div>
            <span className="text-white text-xs font-semibold drop-shadow">View</span>
          </div>
        </div>
        {/* Mobile tap indicator - always visible on small screens */}
        <div className="absolute bottom-2 right-2 sm:hidden bg-black/40 backdrop-blur-sm rounded-full p-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-stone-800 text-sm truncate" title={photo.name}>
          {photo.name}
        </h3>
        <p className="text-xs text-stone-500 mt-1 mb-4">
          {new Date(photo.createdTime).toLocaleDateString()}
        </p>
        
        <div className="mt-auto flex gap-2">
          <a 
            href={photo.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={photo.name}
            className="flex-1 flex items-center justify-center space-x-2 bg-amber-50 hover:bg-amber-100 text-amber-600 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
          
          {adminMode && (
             <button
              onClick={() => onDelete(photo.id)}
              className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
              title="Delete Photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoCard;
