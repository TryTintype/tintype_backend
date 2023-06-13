const mongoose = require("mongoose")
const userModels = require("../models/userModels")
const groupMessageModels = require("../models/groupMessageModel")
 
const chatRoomSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    users: [userModels],
    messages: [groupMessageModels]
  });
  
  module.exports = mongoose.model('ChatRoom', chatRoomSchema);
  
  