var multer = require('multer');
var storage = multer.memoryStorage();
var multerUploads = multer({ storage }).any();



const upload = multer({ storage });


module.exports = { multerUploads, upload };
