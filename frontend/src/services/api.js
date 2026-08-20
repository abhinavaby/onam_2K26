import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const uploadPhotos = (formData) => {
  return api.post('/photos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getPhotos = () => {
  return api.get('/photos');
};

export const deletePhoto = (fileId, adminPassword) => {
  return api.delete(`/photos/${fileId}`, {
    headers: {
      Authorization: `Bearer ${adminPassword}`,
    },
  });
};

export const bulkDeletePhotos = (fileIds, adminPassword) => {
  return api.post('/photos/bulk-delete', { fileIds }, {
    headers: {
      Authorization: `Bearer ${adminPassword}`,
    },
  });
};

export default api;
