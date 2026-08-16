const supabaseService = require('../services/supabaseService');

const uploadPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadedFiles = [];
    for (const file of req.files) {
      const result = await supabaseService.uploadFile(file);
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

module.exports = {
  uploadPhotos,
  getPhotos,
  deletePhoto,
};
