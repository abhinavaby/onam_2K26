import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

const STORAGE_KEY = 'kalhara_user_name';

export const UserProvider = ({ children }) => {
  const [userName, setUserNameState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || '';
  });
  
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isInitialPrompt, setIsInitialPrompt] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem(STORAGE_KEY);
    if (!savedName || !savedName.trim()) {
      // First visit - prompt user once
      setIsInitialPrompt(true);
      setIsNameModalOpen(true);
    }
  }, []);

  const updateUserName = (name) => {
    const trimmed = name.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
      setUserNameState(trimmed);
      setIsNameModalOpen(false);
      setIsInitialPrompt(false);
      return true;
    }
    return false;
  };

  const openNameModal = () => {
    setIsInitialPrompt(false);
    setIsNameModalOpen(true);
  };

  const closeNameModal = () => {
    // Only allow closing without saving if user already has a saved name
    if (userName && userName.trim()) {
      setIsNameModalOpen(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        hasUserName: Boolean(userName && userName.trim()),
        isNameModalOpen,
        isInitialPrompt,
        updateUserName,
        openNameModal,
        closeNameModal,
        setIsNameModalOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
