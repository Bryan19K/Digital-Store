const sharp = require('sharp');

const optimizeImage = async (buffer, width = 800, height = 600) => {
  return await sharp(buffer)
    .resize(width, height, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toBuffer();
};

module.exports = optimizeImage;
