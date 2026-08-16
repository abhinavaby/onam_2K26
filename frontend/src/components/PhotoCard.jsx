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
      <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-stone-100">
        <img 
          src={photo.publicUrl} 
          alt={photo.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <button 
            onClick={() => onClick(photo)}
            className="opacity-0 group-hover:opacity-100 bg-white/90 text-stone-900 p-3 rounded-full transform transtone-y-4 group-hover:transtone-y-0 transition-all duration-300 shadow-lg hover:scale-110"
            title="Preview"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
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
