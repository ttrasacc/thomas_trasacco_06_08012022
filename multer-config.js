const multer = require('multer');
const fs = require('fs');
const dir = './images';
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, 'images'));
    },
    filename: (req, file, callback) => {
        let name = file.originalname.replace(/[\s]/, '_')
        name = name.replace(/\..*/, '');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '_' + Date.now() + '.' + extension);
    }
});

module.exports = () => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    return  multer({storage: storage}).single('image');
};