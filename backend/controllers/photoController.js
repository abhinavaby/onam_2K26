const supabaseService = require('../services/supabaseService');

const uploadPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploaderName = (req.body.uploaderName || req.body.uploader_name || 'Anonymous').trim();

    const uploadedFiles = [];
    for (const file of req.files) {
      const result = await supabaseService.uploadFile(file, uploaderName);
      uploadedFiles.push(result);
    }

    res.status(200).json({
      success: true,
      message: 'Photos uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    next(error);
  }
};

const getPhotos = async (req, res, next) => {
  try {
    const files = await supabaseService.listFiles();
    res.status(200).json({
      success: true,
      photos: files,
    });
  } catch (error) {
    next(error);
  }
};

const deletePhoto = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    await supabaseService.deleteFile(fileId);
    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deletePhotos = async (req, res, next) => {
  try {
    const { fileIds } = req.body;
    if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No file IDs provided' });
    }
    await supabaseService.deleteFiles(fileIds);
    res.status(200).json({
      success: true,
      message: 'Photos deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPhotos,
  getPhotos,
  deletePhoto,
  deletePhotos,
};
