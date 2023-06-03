const mongoose = require('mongoose');
const {File, FileData, FileRef} = require('../models/newFileHandlerModel');
const mime = require('mime')
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');


const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

module.exports.uploadFile = async (req, res, next) => {

    const name = req.body.name
    const buffer = req.files[0].buffer;
    const owner = req.body.user_id
    const privacy = 'private'

    if (! buffer) {
        throw new Error('No file uploaded');
    }

    try {
        const size = buffer.length;

        if (size > MAX_FILE_SIZE) {
            throw new Error(`File size exceeds limit of ${MAX_FILE_SIZE} bytes`);
        }

        const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

        const fileData = new FileData({data: buffer});
        await fileData.save();

        const file = new File({
            file: fileData._id,
            mimetype: "application/octet-stream", // this should be dynamic
            length: size,
            checksum,
            uri: `/files/${uuidv4()}`
        });

        const fileRef = new FileRef({
            name,
            file: file._id,
            owner,
            privacy: privacy || 'private'
        });

        await file.save();
        await fileRef.save();
        res.status(201).json({message: 'File uploaded successfully'});

    } catch (err) {
        if (err.code === 11000) {
            res.status(409).json({error: 'File already exists'});
        } else {
            console.log(err);
            res.status(500).json({error: 'Server error'});
        }
    }
    // return file;
}

module.exports.getFileByUri = async (req, res, next) => {
    const uri = req.body.uri
    return await File.findOne({uri}).populate('file');
}

module.exports.getFileRefsByOwner = async (req, res, next,) => {
    const owner = req.body.user_id
    return await FileRef.find({owner}).populate('file');
}

// module.exports = {
//     // uploadFile,
//     getFileByUri,
//     getFileRefsByOwner
// };


// module.exports.Upload = async (req, res, next) => {
//     console.log(req)
//     try {
//         const file = req.files[0].file;
//         const newFile = new File({
//             name: file.name,
//             mimetype: file.type,
//             length: file.size,
//             owner: req.user._id,
//             privacy: 'private'
//         });

//         // Validate the file type
//         if (!/\.(jpg|jpeg|png|gif)$/.test(file.name)) {
//             throw new Error('Invalid file type');
//         }

//         // Validate the file size
//         if (file.size > 10000000) {
//             throw new Error('File is too large');
//         }

//         // Check if the user is authorized to upload files
//         if (!req.user.hasRole('admin')) {
//             throw new Error('Unauthorized');
//         }

//         await newFile.save();
//         res.status(200).json({message: 'File uploaded successfully'});
//     } catch (err) {
//         next(err);
//     }
// }

// // Fetch all files in the database
// module.exports.GetAllFiles = async (req, res, next) => {
//     try {
//         const files = await File.find().sort({createdAt: -1});
//         res.status(200).json({files});
//     } catch (err) {
//         next(err);
//     }
// };

// // Find files by type e.g .jpg, png, blend, mp4
// module.exports.FindFilesByType = async (req, res, next) => {
//     try {
//         const files = await File.find({mimetype: req.query.type}).sort({createdAt: -1});
//         res.status(200).json({files});
//     } catch (err) {
//         next(err);
//     }
// };

// // A controller to delete a file
// module.exports.DeleteFile = async (req, res, next) => {
//     try {
//         const fileId = req.params.id;
//         const file = await File.findById(fileId);
//         if (! file) {
//             throw new Error('File not found');
//         }
//         if (file.privacy === 'private' && file.owner !== req.user) {
//             throw new Error('You are not authorized to delete this file');
//         }
//         await file.remove();
//         res.status(200).json({message: 'File deleted successfully'});
//     } catch (err) {
//         next(err);
//     }
// };

// // A controller to download a file
// module.exports.DownloadFile = async (req, res, next) => {
//     try {
//         const fileId = req.params.id;
//         const file = await File.findById(fileId);
//         if (! file) {
//             throw new Error('File not found');
//         }
//         if (file.privacy === 'private' && file.owner !== req.user) {
//             throw new Error('You are not authorized to download this file');
//         }
//         const stream = await file.getStream();
//         res.set('Content-Type', file.mimetype);
//         res.set('Content-Length', file.length);
//         res.set('Content-Disposition', 'attachment; filename=' + file.name);
//         res.writeHead(200);
//         stream.pipe(res);
//     } catch (err) {
//         next(err);
//     }
// };

// // A controller to list files by user
// module.exports.ListFilesByUser = async (req, res, next) => {
//     try {
//         const userId = req.params.id;
//         const files = await File.find({owner: userId}).sort({createdAt: -1});
//         res.status(200).json({files});
//     } catch (err) {
//         next(err);
//     }
// };

// // A controller to list files by date
// module.exports.ListFilesByDate = async (req, res, next) => {
//     try {
//         const date = req.query.date;
//         const files = await File.find({createdAt: new Date(date)}).sort({createdAt: -1});
//         res.status(200).json({files});
//     } catch (err) {
//         next(err);
//     }
// };

// // A controller to list files by size
// module.exports.ListFilesBySize = async (req, res, next) => {
//     try {
//         const size = req.query.size;
//         const files = await File.find({
//             length: {
//                 $gt: size
//             }
//         }).sort({createdAt: -1});
//         res.status(200).json({files});
//     } catch (err) {
//         next(err);
//     }
// };

// // A controller to search for files
// module.exports.SearchFiles = async (req, res, next) => {
//     try {
//         const query = req.query.query;
//         const files = await File.find({
//             name: {
//                 $regex: query,
//                 $options: 'i'
//             }
//         }).sort({createdAt: -1});
//         res.status(200).json({files});
//     } catch (err) {
//         next(err);
//     }
// };

// // A controller to manage file permissions
// module.exports.ManageFilePermissions = async (req, res, next) => {
//     try {
//         const fileId = req.params.id;
//         const newPrivacy = req.body.privacy;
//         const file = await File.findById(fileId);
//         if (! file) {
//             throw new Error('File not found');
//         }
//         if (file.privacy === 'private' && file.owner !== req.user) {
//             throw new Error('You are not authorized to change the privacy of this file');
//         }
//         file.privacy = newPrivacy;
//         await file.save();
//         res.status(200).json({message: 'File privacy updated successfully'});
//     } catch (err) {
//         next(err);
//     }
// };
