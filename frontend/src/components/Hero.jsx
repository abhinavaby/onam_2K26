import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-2xl my-6">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-green-500/20 mix-blend-overlay"></div>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity pointer-events-none"
      >
        <source src="public/hero-2.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 px-6 py-24 sm:py-32 lg:px-8 text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6 text-amber-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
        >
          Your Memories <br /><br />

        </motion.h1>



        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex items-center justify-center gap-x-6 flex-col sm:flex-row space-y-4 sm:space-y-0"
        >
          <Link
            to="/upload"
            className="flex items-center justify-center space-x-2 rounded-full bg-amber-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 transition-all hover:scale-105"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Upload Photos</span>
          </Link>
          <Link
            to="/gallery"
            className="flex items-center justify-center space-x-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all hover:scale-105"
          >
            <ImageIcon className="w-5 h-5" />
            <span>View Gallery</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
