
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        const fileType = file.originalname.split('.');
        const tempName = 'temp_image.' + fileType[1];
        cb(null, tempName)
    }
})

module.exports = multer({ storage })