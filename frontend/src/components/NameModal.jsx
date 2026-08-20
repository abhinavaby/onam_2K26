import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Check, X, Edit3, HeartHandshake } from 'lucide-react';
import { useUser } from '../context/UserContext';

const NameModal = () => {
  const { 
    userName, 
    isNameModalOpen, 
    isInitialPrompt, 
    updateUserName, 
    closeNameModal 
  } = useUser();

  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNameModalOpen) {
      setInputName(userName || '');
      setError('');
    }
  }, [isNameModalOpen, userName]);

  if (!isNameModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setError('Please enter your name to continue');
      return;
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (trimmed.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    updateUserName(trimmed);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#12141f] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 text-white overflow-hidden"
        >
          {/* Ambient decorative glow inside modal */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close button only visible if not initial forced prompt */}
          {!isInitialPrompt && userName && (
            <button
              onClick={closeNameModal}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center mb-5 text-stone-950 shadow-lg shadow-amber-500/30">
            {isInitialPrompt ? (
              <Sparkles className="w-7 h-7" />
            ) : (
              <Edit3 className="w-6 h-6" />
            )}
          </div>

          {/* Header */}
          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-wide text-white mb-2">
            {isInitialPrompt ? 'Welcome to Kalhara 2K26 ✨' : 'Change Your Name'}
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
            {isInitialPrompt 
              ? 'Enter your name to stamp on your photo uploads. You will only need to enter this once, and you can edit it anytime!'
              : 'Update the name that appears on your uploaded festival photos.'
            }
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="user-name-input"
                className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Your Full Name / Nickname
              </label>
              
              <div className="relative">
                <input
                  id="user-name-input"
                  type="text"
                  autoFocus
                  maxLength={50}
                  value={inputName}
                  onChange={(e) => {
                    setInputName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Rahul Nair, Ananya, Vishnu..."
                  className="w-full px-4 py-3 rounded-2xl bg-stone-900/90 border border-white/15 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-sm sm:text-base text-white placeholder:text-stone-500 outline-none transition-all"
                />
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 font-medium mt-2"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3">
              {!isInitialPrompt && userName && (
                <button
                  type="button"
                  onClick={closeNameModal}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-stone-300 font-semibold text-xs sm:text-sm transition-all"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>{isInitialPrompt ? 'Get Started' : 'Save Changes'}</span>
              </button>
            </div>
          </form>

          {/* Micro Footer note */}
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center text-[11px] text-stone-400 space-x-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-500/80" />
            <span>Saved securely on this browser</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NameModal;
