const cloudinary = require('../config/cloudinary');

async function deleteCloudinaryImage(publicId) {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true, // purge cached versions on CDN
    });
    return result;
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return null;
  }
}

module.exports = { deleteCloudinaryImage };
