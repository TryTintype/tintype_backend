var multer = require('multer');
var storage = multer.memoryStorage();
var multerUploads = multer({ storage }).any();
module.exports = multerUploads;