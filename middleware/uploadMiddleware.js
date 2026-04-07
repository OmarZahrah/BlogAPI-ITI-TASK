const multer = require('multer');

const storage = multer.memoryStorage();

const imageMime = /^image\//;

const fileFilter = (req, file, cb) => {
  if (!imageMime.test(file.mimetype)) {
    cb(new Error('Only image files are allowed'));
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = { upload };
