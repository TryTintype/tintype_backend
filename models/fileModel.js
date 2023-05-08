// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const blenderFileSchema = new Schema({
//   name: { type: String, required: true },
//   file: { type: Schema.Types.ObjectId, ref: 'BlenderFile' }
// });

// const BlenderFileSchema = new Schema({
//   filename: { type: String, required: true },
//   contentType: { type: String, required: true },
//   length: { type: Number, required: true },
//   uploadDate: { type: Date, default: Date.now },
//   md5: { type: String, required: true }
// });

// const BlenderFile = mongoose.model('BlenderFile', BlenderFileSchema);
// const BlenderFileRef = mongoose.model('BlenderFileRef', blenderFileSchema);

// module.exports = { BlenderFile, BlenderFileRef };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileRefSchema = new Schema({
  name: { type: String, required: true },
  file: { type: Schema.Types.ObjectId, ref: 'File' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

const FileSchema = new Schema({
  data: { type: Buffer, required: true },
  mimetype: { type: String, required: true },
  length: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  md5: { type: String, required: true }
});

const File = mongoose.model('File', FileSchema);
const FileRef = mongoose.model('FileRef', fileRefSchema);

module.exports = { File, FileRef };