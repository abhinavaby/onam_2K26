import React from 'react';
import { Link } from 'react-router-dom';
import PhotoCard from './PhotoCard';
import LoadingSkeleton from './LoadingSkeleton';
import { Image as ImageIcon, UploadCloud, Sparkles, RefreshCw } from 'lucide-react';

const PhotoGrid = ({ photos, loading, error, onPhotoClick, adminMode, onDelete, onRetry }) => {
  if (loading) {
    return <LoadingSkeleton count={8} />;
  }

  if (error) {
    return (
      <div className="text-center p-8 sm:p-12 bg-red-950/60 rounded-3xl border border-red-500/30 max-w-xl mx-auto shadow-xl">
        <div className="w-14 h-14 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400">
          <ImageIcon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 font-heading">Unable to Load Gallery</h3>
        <p className="text-red-300 text-sm mb-6">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 px-6 sm:px-12 bg-gradient-to-b from-[#121520] to-[#0d0f17] rounded-3xl sm:rounded-[2.5rem] border border-amber-500/25 max-w-xl mx-auto shadow-2xl">
        <div className="relative w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-3xl flex items-center justify-center mx-auto mb-5 text-stone-950 shadow-xl shadow-amber-500/25">
          <ImageIcon className="w-10 h-10" />
          <div className="absolute -top-1.5 -right-1.5 bg-emerald-400 text-stone-950 p-1 rounded-full border-2 border-stone-900 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-2xl font-black text-white mb-2 font-heading">
          No Photos in the Vault Yet
        </h3>
        
        <p className="text-stone-400 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
          Be the legend who starts the Kalhara 2K26 album! Share your pookkalam, cultural performances, or group smiles.
        </p>

        <Link
          to="/upload"
          className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-stone-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <UploadCloud className="w-5 h-5" />
          <span>Upload First Memory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
      {photos.map((photo) => (
        <PhotoCard 
          key={photo.id} 
          photo={photo} 
          onClick={onPhotoClick}
          adminMode={adminMode}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PhotoGrid;


