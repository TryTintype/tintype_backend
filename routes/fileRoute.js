
const router = require("express").Router()
const { multerUploads, upload } = require("../middlewares/multer")
const { UploadFile, downloadFile, fetchAllFiles, deleteFile, deleteMultipleFiles} = require("../controller/fileController")


router.post('/file-upload', upload.single('file'), UploadFile);
router.post('/file-download/:id', downloadFile);
router.post('/page/:pageNumber', fetchAllFiles);
router.post('/delete-file/:fileId', deleteFile)
router.post('/delete-selected-file', deleteMultipleFiles)

module.exports = router
