
const router = require("express").Router()
const { UploadFile } = require("../controller/fileController")
const multerMiddleware = require("../middlewares/multer")

var multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post('/file-upload', upload.single('file'), UploadFile);

module.exports = router
