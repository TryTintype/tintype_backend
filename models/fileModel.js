const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileRefSchema = new Schema({
  name: { type: String, required: true, trim: true },
  file: { type: Schema.Types.ObjectId, ref: 'File' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  }
}, { timestamps: true });

const FileSchema = new Schema({
  data: { type: Buffer, required: true },
  mimetype: { type: String, required: true },
  length: { type: Number, required: true },
  md5: { type: String, required: true }
}, { timestamps: true });

const File = mongoose.model('File', FileSchema);
const FileRef = mongoose.model('FileRef', fileRefSchema);

module.exports = { File, FileRef };
