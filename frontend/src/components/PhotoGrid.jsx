import React from 'react';
import PhotoCard from './PhotoCard';
import LoadingSkeleton from './LoadingSkeleton';
import { Image as ImageIcon } from 'lucide-react';

const PhotoGrid = ({ photos, loading, error, onPhotoClick, adminMode, onDelete }) => {
  if (loading) {
    return <LoadingSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="text-center p-12 bg-red-50 rounded-3xl border border-red-100 max-w-2xl mx-auto">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center p-16 bg-stone-50 rounded-3xl border border-dashed border-stone-300 max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-stone-700 mb-2">No photos yet</h3>
        <p className="text-stone-500">Be the first to upload photos to the gallery!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
