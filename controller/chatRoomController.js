const chatRoomModel = require("../models/chatRoomModel")
const User = require("../models/userModels")

const chatRoomModel = require("../models/chatRoomModel");
const User = require("../models/userModels");

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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const chatRoom = new chatRoomModel({
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


// module.exports.createRoom = async (req, res, next) => {
//     try {
//         const { email } = req.params
//         const { room_name } = req.body

//         const user = await User.findOne({ email })
//         const chatRoom = new chatRoomModel ({
//             name: room_name,
//             users: [user],
//             messages: []
//         });
        
//         chatRoom.save().then(savedChatRoom => {
//             console.log('Chat room saved:', savedChatRoom)
//         })

//     } catch (err) {
//         console.log(err)
//     }
// }