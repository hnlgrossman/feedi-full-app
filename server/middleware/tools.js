const multer  = require('multer');
// const path = require('path');
// const fs = require('fs');

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Incorrect file");
      error.code = "INCORRECT_FILETYPE";
      return cb(error, false);
    }
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets/uploads");
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname;
        const extension = originalname.split('.').pop();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '.' + extension);
    }
});
  
const uploadFile = multer({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
}).single("file");

module.exports.uploadFile = uploadFile