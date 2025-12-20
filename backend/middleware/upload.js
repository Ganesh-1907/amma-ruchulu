const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/products'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Configure upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to convert absolute paths to relative paths
const convertToRelativePath = (req, res, next) => {
  if (req.files) {
    req.files = req.files.map(file => {
      const relativePath = path.relative(path.join(__dirname, '..'), file.path);
      return {
        ...file,
        path: relativePath.replace(/\\/g, '/') // Convert Windows paths to URL format
      };
    });
  }
  next();
};

module.exports = { upload, convertToRelativePath }; 