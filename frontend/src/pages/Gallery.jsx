import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PhotoGrid from '../components/PhotoGrid';
import ImageModal from '../components/ImageModal';
import { getPhotos, deletePhoto } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Sparkles, 
  UploadCloud, 
  ArrowUpDown, 
  Lock, 
  X, 
  Trash2,
  RefreshCw
} from 'lucide-react';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest'
  
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Admin delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, photoId: null, password: '', error: '', deleting: false });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPhotos();
      if (res.data.success) {
        setPhotos(res.data.photos);
      }
    } catch (err) {
      setError('Failed to load gallery. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = useMemo(() => {
    let result = [...photos];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name && p.name.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const dateA = new Date(a.createdTime || 0).getTime();
      const dateB = new Date(b.createdTime || 0).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [photos, searchQuery, sortBy]);

  const handlePhotoClick = (photo) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id);
    setSelectedPhotoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedPhotoIndex(null);
    document.body.style.overflow = 'auto';
  };

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const openDeleteModal = (photoId) => {
    setDeleteModal({ open: true, photoId, password: '', error: '', deleting: false });
  };

  const handleConfirmDelete = async (e) => {
    e.preventDefault();
    if (!deleteModal.password) {
      setDeleteModal(prev => ({ ...prev, error: 'Please enter the admin password.' }));
      return;
    }

    try {
      setDeleteModal(prev => ({ ...prev, deleting: true, error: '' }));
      const res = await deletePhoto(deleteModal.photoId, deleteModal.password);
      if (res.data.success) {
        setPhotos(prev => prev.filter(p => p.id !== deleteModal.photoId));
        setStatus({ type: 'success', message: 'Photo deleted successfully from Google Drive.' });
        setDeleteModal({ open: false, photoId: null, password: '', error: '', deleting: false });
        setTimeout(() => setStatus({ type: '', message: '' }), 3500);
      }
    } catch (err) {
      setDeleteModal(prev => ({ 
        ...prev, 
        deleting: false, 
        error: err.response?.data?.message || 'Incorrect admin password.' 
      }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-16 max-w-7xl mx-auto"
    >
      {/* Clean Minimal Header */}
      <div className="pt-2 pb-4 flex items-center justify-between">
        <div className="flex items-baseline space-x-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Gallery
          </h1>
          <span className="text-xs sm:text-sm text-stone-400 font-medium">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>

        {/* Compact Sort */}
        <div className="flex items-center space-x-1 bg-stone-900/80 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setSortBy('newest')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              sortBy === 'newest'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortBy('oldest')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              sortBy === 'oldest'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* Clean Search Input */}
      <div className="mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-stone-900/80 border border-white/10 focus:border-amber-500 text-sm text-white placeholder:text-stone-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Global Toast Alert */}
      <AnimatePresence>
        {status.message && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 shadow-lg
              ${status.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/80 text-red-300 border border-red-500/40'}
            `}
          >
            {status.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
            <p className="font-semibold text-sm">{status.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Photos Grid Component */}
      <PhotoGrid 
        photos={filteredPhotos} 
        loading={loading} 
        error={error} 
        onPhotoClick={handlePhotoClick} 
        adminMode={true}
        onDelete={openDeleteModal}
        onRetry={fetchPhotos}
      />

      {/* Lightbox / Modal */}
      {selectedPhotoIndex !== null && (
        <ImageModal 
          photo={filteredPhotos[selectedPhotoIndex]} 
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedPhotoIndex < filteredPhotos.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}

      {/* Custom Admin Delete Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#131622] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/15 relative text-white"
            >
              <button
                onClick={() => setDeleteModal({ open: false, photoId: null, password: '', error: '', deleting: false })}
                className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4 border border-red-500/30">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white font-heading">Delete Photo</h3>
              <p className="text-sm text-stone-400 mt-1 mb-5">
                This will permanently remove the photo from Google Drive storage. Admin authorization is required.
              </p>

              <form onSubmit={handleConfirmDelete} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" /> Admin Password
                  </label>
                  <input
                    type="password"
                    autoFocus
                    value={deleteModal.password}
                    onChange={(e) => setDeleteModal(prev => ({ ...prev, password: e.target.value, error: '' }))}
                    placeholder="Enter admin password"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-white/15 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm text-white outline-none transition-all"
                  />
                  {deleteModal.error && (
                    <p className="text-xs text-red-400 font-medium mt-1.5">{deleteModal.error}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteModal({ open: false, photoId: null, password: '', error: '', deleting: false })}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-stone-300 font-semibold text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleteModal.deleting}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center space-x-1.5"
                  >
                    {deleteModal.deleting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Confirm Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Gallery;


