const mongoose = require('mongoose');
const {File, FileRef} = require('../models/fileModel');
const crypto = require('crypto');

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB


module.exports.UploadFile = async (req, res, next) => {
    try {

        const name = req.body.name
        const buffer = req.file.buffer;
        // const ownerId = req.user._id; Assuming the user ID is stored in req.user
        const userId = req.body.user_id

        // console.error(req.file);


        const size = buffer.length;
        if (size > MAX_FILE_SIZE) {
            return res.status(400).json({error: `File size exceeds the limit of ${MAX_FILE_SIZE} bytes`});
        }

        const { visibility } = req.body;
        const file = req.file;

        console.log(file)
        if (!file) {
          return res.status(400).json({ message: 'No file provided' });
        }

        const md5 = crypto.createHash('md5').update(file.buffer).digest('hex');

        // Save file data to the database
        const newFile = new File({
          data: file.buffer,
          mimetype: file.mimetype,
          length: file.size,
          md5: md5 || '' // Use the md5 provided by multer or an empty string
        });

        const savedFile = await newFile.save();

        // Save file reference to the database
        const newFileRef = new FileRef({
          name: file.originalname,
          file: savedFile._id,
          owner: userId,
          visibility: visibility || 'private'
        });

        const savedFileRef = await newFileRef.save();
        res.status(201).json(savedFileRef);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading filexx' });
      }
    }

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


// module.exports.UploadFile = async (req, res, next) => {
//         console.log(req)
//         const name = req.body.name;
//         const buffer = req.files[0].buffer;
//         const owner = req.body.user_id;
//         const privacy = req.body.privacy || 'private';

//         if (!buffer) {
//             return res.status(400).json({error: 'No file uploaded'});
//         }

//         try {
//             const size = buffer.length;

//             if (size > MAX_FILE_SIZE) {
//                 return res.status(400).json({error: `File size exceeds the limit of ${MAX_FILE_SIZE} bytes`});
//             }

//             const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

//             const fileData = new FileData({data: buffer});
//             await fileData.save();

//             const fileRef = new FileRef({name, file: fileData._id, owner, privacy});
//             await fileRef.save();

//             const file = new File({
//                 file: fileRef._id,
//                 mimetype: req.files[0].mimetype,
//                 length: size,
//                 checksum,
//                 uri: `/files/${
//                     uuidv4()
//                 }`
//             });
//             await file.save();

//             res.status(201).json({message: 'File uploaded successfully'});
//         } catch (err) {
//             if (err.code === 11000) {
//                 res.status(409).json({error: 'File already exists'});
//             } else {
//                 console.error(err);
//                 res.status(500).json({error: 'Server error'});
//             }
//         }
//     };
