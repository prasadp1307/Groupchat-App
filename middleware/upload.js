const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Utility function to create directories if they don't exist
const createDirectories = (dir) => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Define storage options for multer
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const ext = file.mimetype.split("/")[0];
        let dir;
        if (ext === "image") {
            dir = path.join(__dirname, '../uploads/images');
        } else {
            dir = path.join(__dirname, '../uploads/others');
        }
        createDirectories(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Create multer instance with defined storage
const upload = multer({ storage: multerStorage });

module.exports = upload;
