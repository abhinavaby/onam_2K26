import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white shadow-2xl my-6 sm:my-10 border border-amber-500/20 glow-gold-subtle min-h-[70vh] flex items-center justify-center">
      {/* Dynamic ambient glowing background lights */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-950/90 via-stone-900/60 to-amber-950/40 z-1 pointer-events-none"></div>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105 filter contrast-125 pointer-events-none"
      >
        <source src="/hero-2.mp4" type="video/mp4" />
      </video>

      {/* Hero Content - Clean, Minimal & Majestic */}
      <div className="relative z-10 px-6 py-20 sm:py-28 text-center max-w-4xl mx-auto flex flex-col items-center justify-center">
        
        {/* Majestic Festival Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-6xl sm:text-8xl md:text-9xl font-black tracking-widest text-gradient-gold drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] select-none leading-tight mb-8 sm:mb-10"
        >
          KALHARA
        </motion.h1>

        {/* Clean Action CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto px-4"
        >
          <Link
            to="/upload"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 px-8 py-4 text-sm sm:text-base font-bold text-stone-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <UploadCloud className="w-5 h-5" />
            <span>Upload Photos</span>
          </Link>

          <Link
            to="/gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-amber-400/40 px-8 py-4 text-sm sm:text-base font-bold text-white backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <span>View Gallery</span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Hero;


