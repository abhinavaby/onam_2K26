import React, { useState, useEffect } from 'react';
import PhotoGrid from '../components/PhotoGrid';
import ImageModal from '../components/ImageModal';
import { getPhotos, deletePhoto } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await getPhotos();
      if (res.data.success) {
        setPhotos(res.data.photos);
      }
    } catch (err) {
      setError('Failed to load gallery. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo) => {
    const index = photos.findIndex(p => p.id === photo.id);
    setSelectedPhotoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
    document.body.style.overflow = 'auto';
  };

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const handleDelete = async (fileId) => {
    const password = window.prompt("Enter admin password to delete this photo:");
    if (!password) return;

    try {
      setStatus({ type: '', message: '' });
      const res = await deletePhoto(fileId, password);
      if (res.data.success) {
        setPhotos(prev => prev.filter(p => p.id !== fileId));
        setStatus({ type: 'success', message: 'Photo deleted successfully.' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      }
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to delete photo. Incorrect password?' 
      });
      setTimeout(() => setStatus({ type: '', message: '' }), 4000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-12"
    >
      <div className="mb-6 mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">Gallery</h1>
          <p className="mt-2 text-lg text-stone-600">Explore all uploaded memories.</p>
        </div>
      </div>

      <AnimatePresence>
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center space-x-3
              ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}
            `}
          >
            {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-medium">{status.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <PhotoGrid 
        photos={photos} 
        loading={loading} 
        error={error} 
        onPhotoClick={handlePhotoClick} 
        adminMode={true}
        onDelete={handleDelete}
      />

      {selectedPhotoIndex !== null && (
        <ImageModal 
          photo={photos[selectedPhotoIndex]} 
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedPhotoIndex < photos.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}
    </motion.div>
  );
};

export default Gallery;
