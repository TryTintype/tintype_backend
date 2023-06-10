const mongoose = require('mongoose');
const {File, FileRef} = require('../models/fileModel');
const crypto = require('crypto');

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

module.exports.UploadFile = async (req, res, next) => {
    try {
        const name = req.body.name
        const buffer = req.file.buffer;
        const userId = req.body.user_idx

        const size = buffer.length;
        if (size > MAX_FILE_SIZE) {
            throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE} bytes`)
            // return res.status(400).json({error: `File size exceeds the limit of ${MAX_FILE_SIZE} bytes`});
        }

        const {visibility} = req.body;
        const file = req.file;

        if (!file) {
            throw new Error('No file provided')
            // return res.status(400).json({message: 'No file provided'});
        }

        const md5 = crypto.createHash('md5').update(file.buffer).digest('hex');

        // Save file data to the database
        const newFile = new File({
            data: file.buffer,
            mimetype: file.mimetype,
            length: file.size,
            md5: md5
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
        next(error)
    }
}

module.exports.downloadFile = async (req, res, next) => {
    try {
      const fileId = req.params.id;

      // Retrieve the file reference from the FileRef collection
      const fileRef = await FileRef.findById(fileId);

      if (!fileRef) {
        throw new Error('File not found' )
        // return res.status(404).json({ message: 'File not found' });
      }

      // Retrieve the file data from the File collection
      const file = await File.findById(fileRef.file);

      if (!file) {
        throw new Error('File data not found' )
        // return res.status(404).json({ message: 'File data not found' });
      }

      // Set the response headers and send the file data
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Length', file.length);
      res.setHeader('Content-Disposition', `attachment; filename=${fileRef.name}`);
      res.send(file.data);
    } catch (error) {
        next(error)
    //   console.error(error);
    //   res.status(500).json({ message: 'Error downloading file' });
    }
  };

  module.exports.fetchAllFiles = async (req, res, next) => {
    // /files/all?page=1&itemsPerPage=10
    try {
      const page = parseInt(req.params.pageNumber) || 1; // Default to page 1
      const itemsPerPage = 10; // Default to 10 items per page

      // Calculate the number of documents to skip
      const skip = (page - 1) * itemsPerPage;

      // Retrieve the paginated file references from the FileRef collection
      const fileRefs = await FileRef.find()
        .skip(skip)
        .limit(itemsPerPage);

      // Return the file references as a JSON response
      res.status(200).json(fileRefs);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching files' });
    }
  };

module.exports.deleteFile = async (req, res, next) => {
    try {
      const fileId = req.params.id;

      // Retrieve the file reference from the FileRef collection
      const fileRef = await FileRef.findById(fileId);

      if (!fileRef) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Delete the file data from the File collection
      await File.findByIdAndDelete(fileRef.file);

      // Delete the file reference from the FileRef collection
      await FileRef.findByIdAndDelete(fileId);

      // Return a success message as the response
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting file' });
    }
  };

  module.exports.deleteMultipleFiles = async (req, res, next) => {
    try {
      const fileIds = req.body.fileIds; // Assuming fileIds is an array of file IDs

        if (fileIds.length < 1) {
           return res.status(401).json({ message: 'no files to delete' });
        }
      // Loop through each file ID and delete the corresponding files
      for (const fileId of fileIds) {
        // Retrieve the file reference from the FileRef collection
        const fileRef = await FileRef.findById(fileId);

        if (!fileRef) {
          return res.status(404).json({ message: `File with ID ${fileId} not found` });
        }

        // Delete the file data from the File collection
        await File.findByIdAndDelete(fileRef.file);

        // Delete the file reference from the FileRef collection
        await FileRef.findByIdAndDelete(fileId);
      }

      // Return a success message as the response
      res.status(200).json({ message: 'Files deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting files' });
    }
  };
