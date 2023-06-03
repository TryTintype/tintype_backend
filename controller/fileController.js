// const mongoose = require('mongoose');
// const {File, FileRef} = require('../models/fileModel');
// const crypto = require('crypto');

// module.exports.UploadFile = async (req, res, next) => {
//     try {
//         const name = req.body.name
//         const fileBuffer = req.files[0].buffer;
//         // const ownerId = req.user._id; Assuming the user ID is stored in req.user
//         const ownerId = req.body.user_id


//         if (! fileBuffer) {
//             throw new Error('No file uploaded');
//         }

//         const md5 = crypto.createHash('md5').update(fileBuffer).digest('hex');

//         const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//             chunkSizeBytes: 1024 * 1024,
//             bucketName: 'fileUploads'
//         });

//         const uploadStream = bucket.openUploadStream(name, {
//             metadata: {
//                 md5: md5,
//                 owner: ownerId
//             }
//         });

//         uploadStream.write(fileBuffer);
//         uploadStream.end();

//         uploadStream.on('finish', async () => {
//             const fileId = uploadStream.id;

//             const uploadedFile = new File({data: fileBuffer, mimetype: req.files[0].mimetype, length: fileBuffer.length, md5: md5});
//             await uploadedFile.save();

//             const fileRef = new FileRef({name: name, file: uploadedFile._id, owner: ownerId});
//             await fileRef.save();

//             res.status(201).json({message: 'File uploaded successfully'});
//         });

//         uploadStream.on('error', (err) => {
//             throw new Error('File upload failed');
//         });
//     } catch (err) {
//         next(err);
//     }
// };
