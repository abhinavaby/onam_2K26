import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Image as ImageIcon, UploadCloud, Sparkles, User, Edit3 } from 'lucide-react';
import clsx from 'clsx';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const location = useLocation();
  const { userName, openNameModal } = useUser();

  const navLinks = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/gallery', label: 'Gallery', icon: ImageIcon },
    { path: '/upload', label: 'Upload', icon: UploadCloud },
  ];

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#090a0f]/90 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <span className="font-display font-black text-xl sm:text-2xl tracking-widest text-gradient-gold">
              KALHARA
            </span>
          </Link>
          
          {/* Right section: Links + User Name Badge */}
          <div className="flex items-center space-x-3">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 bg-stone-900/90 p-1 rounded-xl border border-white/10">
              {navLinks.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={clsx(
                      'flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all',
                      isActive 
                        ? 'bg-amber-500 text-stone-950 font-bold' 
                        : 'text-stone-300 hover:text-white'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Profile Badge (Clickable to change name) */}
            <button
              onClick={openNameModal}
              title="Click to change your name"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-semibold shadow-xs hover:border-amber-400/50 transition-all active:scale-95 cursor-pointer group"
            >
              <div className="w-5 h-5 rounded-lg bg-amber-500/20 group-hover:bg-amber-500 text-amber-400 group-hover:text-stone-950 flex items-center justify-center transition-colors">
                <User className="w-3 h-3" />
              </div>
              <span className="max-w-[100px] sm:max-w-[140px] truncate font-medium">
                {userName || 'Enter Name'}
              </span>
              <Edit3 className="w-3 h-3 text-amber-400/70 group-hover:text-amber-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0d13]/95 backdrop-blur-2xl border-t border-white/10 shadow-2xl px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navLinks.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={clsx(
                  'flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative',
                  isActive 
                    ? 'text-amber-400 font-bold scale-105' 
                    : 'text-stone-400 hover:text-stone-200 font-medium'
                )}
              >
                <div className={clsx(
                  'p-1.5 rounded-xl transition-all',
                  isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight">{label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 shadow-sm shadow-amber-400"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;


