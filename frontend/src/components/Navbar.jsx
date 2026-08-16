import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Image, UploadCloud } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Camera },
    { path: '/gallery', label: 'Gallery', icon: Image },
    { path: '/upload', label: 'Upload', icon: UploadCloud },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 border-b border-stone-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl tracking-tight">
          <Camera className="w-6 h-6 text-amber-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-green-500">
            OnamGallery
          </span>
        </Link>
        
        <div className="flex items-center space-x-1 sm:space-x-4">
          {navLinks.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={clsx(
                  'flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-amber-50 text-amber-600 shadow-sm' 
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline-block">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
