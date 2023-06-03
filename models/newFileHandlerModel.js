const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const fileType = require('file-type');
// const crypto = require('crypto');

const fileRefSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    file: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    privacy: {
        type: String,
        enum: [
            'public', 'private'
        ],
        default: 'private'
    }
});

const fileDataSchema = new Schema({
    data: {
        type: Buffer,
        required: true
    }
});

fileDataSchema.virtual('id').get(function () {
    return this._id;
});

fileDataSchema.set('toJSON', {virtuals: true});

const File = mongoose.model('File', new Schema({
    file: {
        type: Schema.Types.ObjectId,
        ref: 'FileData',
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    checksum: {
        type: String,
        required: true
    },
    uri: {
        type: String,
        required: true,
        unique: true
    }
}));

const FileRef = mongoose.model('FileRef', fileRefSchema);
const FileData = mongoose.model('FileData', fileDataSchema);

module.exports = {
    File,
    FileRef,
    FileData
};


// const Schema = mongoose.Schema;

// const fileRefSchema = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     file: {
//         type: Schema.Types.ObjectId,
//         ref: 'File'
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

// const FileSchema = new Schema({
//     file: {
//         type: Buffer,
//         required: true
//     },
//     mimetype: {
//         type: String,
//         required: true,
//         validate: {
//             validator: function (value) {
//                 return /[a-zA-Z0-9+/=]+;[a-zA-Z0-9+/=]+/.test(value);
//             }
//         }
//     },
//     length: {
//         type: Number,
//         required: true,
//         validate: {
//             validator: function (value) {
//                 return value > 0;
//             }
//         }
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
//         default: function () {
//             return `/files/${
//                 this._id
//             }`;
//         }
//     }
// });

// const File = mongoose.model('File', FileSchema);
// const FileRef = mongoose.model('FileRef', fileRefSchema);

// module.exports = {
//     File,
//     FileRef
// };
