import React from 'react';
import UploadZone from '../components/UploadZone';
import { motion } from 'framer-motion';

const Upload = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="pb-12 max-w-3xl mx-auto"
    >
      {/* Clean Minimal Header */}
      <div className="pt-2 pb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading mb-1">
          Upload Photos
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Upload memories directly to the Kalhara 2K26 album
        </p>
      </div>

      {/* Main Upload Dropzone */}
      <UploadZone />
    </motion.div>
  );
};

export default Upload;



