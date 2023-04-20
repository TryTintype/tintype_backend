const ChatRoomModel = require("../models/chatRoomModel");
const UserModel = require("../models/userModels");

module.exports.createRoom = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { room_name } = req.body;

    // Validate inputs
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!room_name || typeof room_name !== "string") {
      return res.status(400).json({ error: "Room name is required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const chatRoom = new ChatRoomModel({
      name: room_name,
      users: [user],
      messages: [],
    });

    const savedChatRoom = await chatRoom.save();
    console.log("Chat room saved:", savedChatRoom);
    return res.status(201).json(savedChatRoom);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
};


module.exports.addMemberToProject = async (req, res, next) => {
    try {
      const { room_id } = req.params;
      const { email } = req.body;
  
      // Validate inputs
      if (!room_id) {
        return res.status(400).json({ error: "Room ID is required" });
      }
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
  
      // Find the chat room
      const chatRoom = await ChatRoomModel.findById(room_id);
      if (!chatRoom) {
        return res.status(404).json({ error: "Chat room not found" });
      }
  
      // Find the user to add
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the user is already in the chat room
      const isUserInChatRoom = chatRoom.users.some(
        (chatRoomUser) => chatRoomUser._id.toString() === user._id.toString()
      );
      if (isUserInChatRoom) {
        return res
          .status(400)
          .json({ error: "User is already a member of this chat room" });
      }
  
      // Add the user to the chat room
      chatRoom.users.push(user);
      const savedChatRoom = await chatRoom.save();
  
      return res.status(200).json(savedChatRoom);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server error" });
    }
  };

  module.exports.removeMemberFromProject = async (req, res, next) => {
    try {
      const { roomId, memberId } = req.body;
  
      // Check if the room exists
      const room = await ChatRoomModel.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      // Check if the member exists in the room
      const memberIndex = room.users.indexOf(memberId);
      if (memberIndex === -1) {
        return res.status(404).json({ error: 'Member not found in room' });
      }
  
      // Remove the member from the room
      room.users.splice(memberIndex, 1);
      await room.save();
  
      return res.status(200).json({ message: 'Member removed from room' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  module.exports.getAllMembersOfGroup = async (req, res, next) => {
    try {
      const { roomId } = req.params;
  
      // Check if the room exists
      const room = await ChatRoomModel.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      // Get all users in the room
      const users = await UserModel.find({ _id: { $in: room.users } });
  
      return res.status(200).json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  module.exports.inviteUsersToRoom = async (req, res, next) => {
    try {
      const { chatRoomId } = req.params;
      const { emails } = req.body;
  
      // Find the chat room
      const chatRoom = await ChatRoomModel.findById(chatRoomId);
  
      // Find the users with the specified emails
      const users = await UserModel.find({ email: { $in: emails } });
  
      // Add the users to the chat room
      chatRoom.users.push(...users);
      await chatRoom.save();
  
      res.status(200).json({ message: 'Users invited to chat room.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  