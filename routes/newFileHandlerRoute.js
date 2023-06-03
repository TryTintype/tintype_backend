const express = require('express');
const router = express.Router();
const multerMiddleware = require("../middlewares/multer")

const { uploadFile, getFileByUri, getFileRefsByOwner } = require('../controller/newFileHandlerController')

router.get('/file', getFileByUri)
router.get('/file', getFileRefsByOwner)
router.post('/file/upload', multerMiddleware, uploadFile)

// const {
//     Upload,
//     GetAllFiles,
//     FindFilesByType,
//     DeleteFile,
//     DownloadFile,
//     ListFilesByUser,
//     ListFilesByDate,
//     ListFilesBySize,
//     SearchFiles,
//     ManageFilePermissions
// } = require('../controller/fileHandlerController');

// router.get('/file/', multerMiddleware, GetAllFiles);
// router.get('/file/type/:type', multerMiddleware, FindFilesByType);
// router.get('/file/:id', multerMiddleware, DownloadFile);
// router.get('/file/user/:id', multerMiddleware, ListFilesByUser);
// router.get('/file/date/:date', multerMiddleware, ListFilesByDate);
// router.get('/file/size/:size', multerMiddleware, ListFilesBySize);
// router.post('/file/search', multerMiddleware, SearchFiles);
// router.post('/file',  Upload)
// router.put('/file/:id/permissions', multerMiddleware, ManageFilePermissions);
// router.delete('/file/:id', multerMiddleware, DeleteFile);


module.exports = router;
