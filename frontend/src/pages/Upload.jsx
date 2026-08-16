import React from 'react';
import UploadZone from '../components/UploadZone';
import { motion } from 'framer-motion';

const Upload = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pb-12"
    >
      <div className="text-center mb-10 mt-6">
        <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">Upload to Gallery</h1>
        <p className="mt-3 text-lg text-stone-600">Select photos to securely upload to your Google Drive.</p>
      </div>
      
      <UploadZone />
    </motion.div>
  );
};

export default Upload;
