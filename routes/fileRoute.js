const router = require("express").Router()
const { UploadFile } = require("../controller/fileController")
const multerMiddleware = require("../middlewares/multer")

router.post('/file-upload', multerMiddleware, UploadFile);

module.exports = router
