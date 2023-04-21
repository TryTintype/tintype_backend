const messageModel = require("../models/messageModels")

module.exports.addMessage = async (req, res, next) => {
    try {
        const {from, to, message} = req.body

        const data = messageModel.create({
            message: {
                text: message
            },
            users: [
                from, to
            ],
            sender: from
        })

        if (! data) 
            return res.status(400).json({message: "failed to add message"})       

        return res.status(201).json({message: "added message"})

    } catch (err) {
        next(err)
    }
}

// module.exports.getAllMessages = async (req, res, next) => {
//     try {
//         const {from, to} = req.body

//         // console.log([from, to])

//         const messages = await messageModel.find({
//             users: {
//                 $all: [from, to]
//             }
//         }).sort({updatedAt: 1})

//         const messagesToDisplay = messages.map((msg) => {
//             return {
//                 fromSelf: msg.sender.toString() === from, // compares and returns true or false
//                 message: msg.message.text
//             }
//         })
//         // console.log(messagesToDisplay)
//         res.status(200).json({messagesToDisplay})
//     } catch (err) {
//         next(err)
//     }
// }

module.exports.getAllMessages = async (req, res, next) => {
    try {
      const { from, to } = req.body;
  
      const messages = await messageModel.find({
        users: {
          $all: [from, to]
        }
      }).sort({ updatedAt: 1 });
  
      // const messagesToDisplay = messages.map((msg) => {
      //   return {
      //     fromSelf: msg.sender.toString() === from,
      //     message: msg.message.text,
      //   };
      // });
  
        console.log(messagesToDisplay)
    return res.status(200).json({ messages: {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    } });
    } catch (err) {
      next(err);
    }
  };