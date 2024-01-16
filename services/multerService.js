const multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads/files',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})
const upload = multer({ storage: storage });

module.exports = upload;