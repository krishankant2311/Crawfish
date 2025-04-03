const User = require('../../user/model/userModel')
const Restaurant = require('../../restaurants/model/restaurantModel')
const Message = require('../model/socketIOModel')
const {Conversation} = require("../../socketIO/model/conversationModel")

// const Message = require("../models/Message");

// module.exports = function (io) {
//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);

//     // Room join logic (User & Restaurant)
//     socket.on("joinRoom", ({ userId, restaurantId }) => {
//       const room = `${userId}_${restaurantId}`;
//       socket.join(room);
//       console.log(`User ${userId} joined room ${room}`);
//     });

//     // Message handling
//     socket.on("sendMessage", async ({ userId, restaurantId, message }) => {
//       try {
//         const newMessage = new Message({ userId, restaurantId, message });
//         await newMessage.save();

//         const room = `${userId}_${restaurantId}`;
//         io.to(room).emit("receiveMessage", { userId, message });

//       } catch (error) {
//         console.error("Error saving message:", error);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };

// exports.socket = async(req,res) =>{
//     const { userId, restaurantId } = req.params;
//     try {
//      let token = req.token;
//         const user = await User.findOne({_id:token._id})
//         if(!user){
//             return res.send({
//                 statusCode:404,
//                 success:false,
//                 message:"user not found",
//                 result:{}
//             })
//         }
//         if(user.status === "Delete"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"user has been deleted",
//                 result:{}
//             })
//         }
//         if(user.status === "pending" || user.status === "Block"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"unauthorise access",
//                 result:{}
//             })
//         }
//         const restaurant = await Restaurant.findOne({_id:restaurantId})
//         if(!restaurant){
//             return res.send({
//                 statusCode:404,
//                 success:false,
//                 message:"restaurant not found",
//                 result:{}
//             })
//         }
//         if(restaurant.status === "Delete"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"restaurant has been deleted",
//                 result:{}
//             })
//         }
//         if(restaurant.status==="Block" || restaurant.status==="Pending"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"unauthorised access",
//                 result:{}
//             })
//         }
//       const message = await Message.find({
//         userId: userId,
//         restaurantId: restaurantId
//       })
//         .sort({ createdAt: 1 })
//         .populate("userId", "name") 
//         .populate("restaurantId", "name"); 
      
//         message.userId = userId;
//         message.restaurantId=restaurantId;
//         message=message;

       
//       await message.save();
//       return res.send({ 
//           statusCode:200,
//           success: true,
//            messages:"",
//           result:{message}
//     });
  
//     } catch (error) {
//     return res.send({
//         statusCode:500,
//         success:false,
//         message:error.message + " ERROR in socket api",
//         result:{}
//     })
//     }
// }
// const Message = require("../models/messageModel");
// const User = require("../models/userModel");
// const Restaurant = require("../models/restaurantModel");

// exports.createMessage = async (req, res) => {
//     try {
//       const { userId, restaurantId } = req.params;
//       const {message} = req.body;
//       const token = req.token;
  
//     //   if (userId !== tokenUserId.toString()) {
//     //     return res.status(403).json({
//     //       success: false,
//     //       message: "Unauthorized to send messages.",
//     //     });
//     //   }
  
//       // Validate Message
//       if (!message) {
//         return res.status(400).json({ success: false, message: "Message cannot be empty" });
//       }
  
//       // Save message to DB
//       const newMessage = new Message({ userId, restaurantId, message });
//       await newMessage.save();
  
//       // Emit message via Socket.IO
//       const room = `${userId}_${restaurantId}`;
//       global.io.to(room).emit("receiveMessage", { userId, message });
  
//       return res.status(201).json({
//         success: true,
//         message: "Message sent successfully",
//         data: newMessage,
//       });
  
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: `Error: ${error.message}`,
//       });
//     }
//   };
exports.sendMessages = async (req, res) => {
  try {
    const {userId} = req.id;
    const {restaurantId} = req.params.id;
    const message = req.body;

    let gotConversation = await Conversation.findOne({
        participants: { $all: [userId, restaurantId] },
    });

    if (!gotConversation) {
        gotConversation = await Conversation.create({
            participants: [userId, restaurantId]
        });
    }

    const newMessage = await Message.create({
      userId,
      restaurantId,
        message
    });

    if (newMessage) {
        gotConversation.messages.push(newMessage._id);
    }

    await Promise.all([gotConversation.save(), newMessage.save()]);

    // SOCKET IO
    const restaurantSocketId = getReceiverSocketId(restaurantId);
    if (restaurantSocketId) {
        io.to(restaurantSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
        newMessage
    });

} catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while sending the message." });
}
};

// 🟢 Get Messages between User & Restaurant
exports.getMessages = async (req, res) => {
  try {
    const { userId, restaurantId } = req.params;
    const token = req.token;

    // if (userId !== tokenUserId.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Unauthorized access to messages.",
    //   });
    // }

    // User & Restaurant Validation
    const user = await User.findById(token._id);
    if (!user || user.status === "Delete") {
      return res.status(404).json({ success: false, message: "User not found or deleted" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || restaurant.status === "Delete") {
      return res.status(404).json({ success: false, message: "Restaurant not found or deleted" });
    }

    // Fetch Messages
    const messages = await Message.find({ userId, restaurantId })
      .sort({ createdAt: 1 })
      .populate("userId", "fullName")
      .populate("restaurantId", "restaurantName");
    if(!messages){
      return res.send ({
        statusCode:404,
        success:false,
        message:"messages not found",
        result:{}
      })
    }
    return res.status(200).json({
      success: true,
      message: "Messages retrieved successfully",
      data: {},
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${error.message}`,
    });
  }
};

