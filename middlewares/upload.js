const multer = require('multer');

const storage = multer.memoryStorage(); // เก็บไฟล์ใน RAM แล้วส่ง cloudinary
const upload = multer({ storage });

module.exports = upload;
