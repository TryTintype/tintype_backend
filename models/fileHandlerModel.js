// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const fileRefSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     file: {
//         type: Schema.Types.ObjectId,
//         ref: 'FileData'
//     },
//     owner: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     privacy: {
//         type: String,
//         enum: [
//             'public', 'private'
//         ],
//         default: 'private'
//     }
// });

// const fileDataSchema = new Schema({
//     data: {
//         type: Buffer,
//         required: true
//     }
// });

// fileDataSchema.virtual('id').get(function () {
//     return this._id;
// });

// fileDataSchema.set('toJSON', {virtuals: true});

// const File = mongoose.model('File', {
//     file: {
//         type: Schema.Types.ObjectId,
//         ref: 'FileRef',
//         required: true
//     },
//     mimetype: {
//         type: String,
//         required: true
//     },
//     length: {
//         type: Number,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     checksum: {
//         type: String,
//         required: true
//     },
//     uri: {
//         type: String,
//         required: true,
//         unique: true
//     }
// });

// const FileRef = mongoose.model('FileRef', fileRefSchema);
// const FileData = mongoose.model('FileData', fileDataSchema);

// module.exports = {
//     File,
//     FileRef,
//     FileData
// };
