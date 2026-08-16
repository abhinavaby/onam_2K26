const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME;

const uploadFile = async (fileObject) => {
  try {
    // Generate a unique filename
    const fileExtension = fileObject.originalname.split('.').pop();
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileName = `${Date.now()}-${randomName}.${fileExtension}`;

    // 1. Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileObject.buffer, {
        contentType: fileObject.mimetype,
        upsert: false,
      });

    if (storageError) throw storageError;

    // 2. Get Public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // 3. Insert metadata into Postgres Database 'photos' table
    const { error: dbError } = await supabase
      .from('photos')
      .insert([
        {
          file_name: fileName,
          original_name: fileObject.originalname,
          public_url: publicUrl,
        }
      ]);

    if (dbError) {
      console.warn("File uploaded to storage but failed to insert into DB:", dbError);
      // Depending on requirements, you might want to rollback the storage upload here
      // throw dbError;
    }

    return {
      id: fileName, 
      name: fileObject.originalname,
      path: storageData.path,
      publicUrl: publicUrl
    };
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    throw error;
  }
};

const listFiles = async () => {
  try {
    // Fetch photos from Postgres database instead of listing storage bucket
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // If table doesn't exist, this will error. 
      console.error("DB Fetch Error. Did you create the 'photos' table?", error);
      throw error;
    }

    // Map DB rows to match the format the frontend expects
    const filesWithUrls = data.map((row) => ({
      id: row.file_name, // using file_name as ID for deletion
      name: row.original_name,
      mimeType: 'image/jpeg', // default since we aren't storing mimetype in DB yet
      createdTime: row.created_at,
      publicUrl: row.public_url,
    }));

    return filesWithUrls;
  } catch (error) {
    console.error('Error fetching files from Supabase Database:', error);
    throw error;
  }
};

const deleteFile = async (fileName) => {
  try {
    // 1. Delete from Database
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('file_name', fileName);

    if (dbError) {
      console.warn("Error deleting from DB:", dbError);
    }

    // 2. Delete from Storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (storageError) {
      throw storageError;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
  listFiles,
  deleteFile,
};
