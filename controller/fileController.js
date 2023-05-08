// const mongoose = require('mongoose');
// const {BlenderFile, BlenderFileRef} = require('../models/blenderfileModel');
// const crypto = require('crypto');

// module.exports.UploadBlenderFile = async (req, res, next) => {
//     console.log({body: req.files[0]})
//     try {
//         const name = req.body.name;
//         const fileBuffer = req.files[0].buffer;

//         if (!fileBuffer) {
//             throw new Error('No file uploaded');
//         }

//         const md5 = crypto.createHash('md5').update(fileBuffer).digest('hex');

//         const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//             chunkSizeBytes: 1024 * 1024,
//             bucketName: 'blenderFiles'
//         });

//         const uploadStream = bucket.openUploadStream(name, {
//             metadata: {
//                 md5: md5
//             }
//         });

//         uploadStream.write(fileBuffer);
//         uploadStream.end();

//         uploadStream.on('finish', async () => {
//             const fileId = uploadStream.id;

//             const blenderFile = new BlenderFile({
//                 filename: name,
//                 contentType: 'application/octet-stream',
//                 length: fileBuffer.length,
//                 md5: md5,
//                 fileId: fileId
//             });
//             await blenderFile.save();

//             const blenderFileRef = new BlenderFileRef({name: 'My Blender File', file: blenderFile._id});
//             await blenderFileRef.save();

//             res.status(201).json({message: 'File uploaded successfully'});
//         });

//         uploadStream.on('error', (err) => {
//             throw new Error('File upload failed');
//         });
//     } catch (err) {
//         next(err);
//     }
// };

const mongoose = require('mongoose');
const {File, FileRef} = require('../models/fileModel');
const crypto = require('crypto');

module.exports.UploadFile = async (req, res, next) => { // console.log({body: req.files[0]})
    console.log({name: req.body.name})
    console.log({files: req.files[0].buffer})
    console.log({user_id: req.body.user_id})
    // const ownerId = req.user._id; Assuming the user ID is stored in req.user
    try {
        const name = req.body.name
        const fileBuffer = req.files[0].buffer;
        // const ownerId = req.user._id; Assuming the user ID is stored in req.user
        const ownerId = req.body.user_id


        if (! fileBuffer) {
            throw new Error('No file uploaded');
        }

        const md5 = crypto.createHash('md5').update(fileBuffer).digest('hex');

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            chunkSizeBytes: 1024 * 1024,
            bucketName: 'fileUploads'
        });

        const uploadStream = bucket.openUploadStream(name, {
            metadata: {
                md5: md5,
                owner: ownerId
            }
        });

        uploadStream.write(fileBuffer);
        uploadStream.end();

        uploadStream.on('finish', async () => {
            const fileId = uploadStream.id;

            const uploadedFile = new File({data: fileBuffer, mimetype: req.files[0].mimetype, length: fileBuffer.length, md5: md5});
            await uploadedFile.save();

            const fileRef = new FileRef({name: name, file: uploadedFile._id, owner: ownerId});
            await fileRef.save();

            res.status(201).json({message: 'File uploaded successfully'});
        });

        uploadStream.on('error', (err) => {
            throw new Error('File upload failed');
        });
    } catch (err) {
        next(err);
    }
};
