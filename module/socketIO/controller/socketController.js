const User = require("../../user/model/userModel");
const Restaurant = require("../../restaurants/model/restaurantModel");
const Message = require("../model/socketIOModel");
const { Conversation } = require("../../socketIO/model/conversationModel");

// exports.sendMessages = async (req, res) => {
//   try {
//     const { userId } = req.id;
//     const { restaurantId } = req.params.id;
//     const message = req.body;

//     let gotConversation = await Conversation.findOne({
//       participants: { $all: [userId, restaurantId] },
//     });

//     if (!gotConversation) {
//       gotConversation = await Conversation.create({
//         participants: [userId, restaurantId],
//       });
//     }

//     const newMessage = await Message.create({
//       userId,
//       restaurantId,
//       message,
//     });

//     if (newMessage) {
//       gotConversation.messages.push(newMessage._id);
//     }

//     await Promise.all([gotConversation.save(), newMessage.save()]);

//     // SOCKET IO
//     const restaurantSocketId = getReceiverSocketId(restaurantId);
//     if (restaurantSocketId) {
//       io.to(restaurantSocketId).emit("newMessage", newMessage);
//     }

//     return res.status(201).json({
//       newMessage,
//     });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while sending the message." });
//   }
// };

// 🟢 Get Messages between User & Restaurant
// exports.getMessages = async (req, res) => {
//   try {
//     const { userId, restaurantId } = req.params;
//     const token = req.token;

//     // if (userId !== tokenUserId.toString()) {
//     //   return res.status(403).json({
//     //     success: false,
//     //     message: "Unauthorized access to messages.",
//     //   });
//     // }

//     // User & Restaurant Validation
//     const user = await User.findById(token._id);
//     if (!user || user.status === "Delete") {
//       return res.status(404).json({ success: false, message: "User not found or deleted" });
//     }

//     const restaurant = await Restaurant.findById(restaurantId);
//     if (!restaurant || restaurant.status === "Delete") {
//       return res.status(404).json({ success: false, message: "Restaurant not found or deleted" });
//     }

//     // Fetch Messages
//     const messages = await Message.find({ userId, restaurantId })
//       .sort({ createdAt: 1 })
//       .populate("userId", "fullName")
//       .populate("restaurantId", "restaurantName");
//     if(!messages){
//       return res.send ({
//         statusCode:404,
//         success:false,
//         message:"messages not found",
//         result:{}
//       })
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Messages retrieved successfully",
//       data: {},
//     });

//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: `Internal Server Error: ${error.message}`,
//     });
//   }
// };

exports.getMessages = async (req, res) => {
  try {
    const { userId, restaurantId } = req.body;
    const token = req.token;
    // User & Restaurant Validation
    const user = await User.findById(token._id);
    const restaurant = await Restaurant.findById(restaurantId);
    if (
      !restaurant ||
      restaurant.status === "Delete" ||
      !user ||
      user.status === "Delete"
    ) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant not found or deleted",
        result: {},
      });
    }
    // Fetch Messages
    const messages = await Message.find({ userId, restaurantId })
      .sort({ createdAt: 1 })
      .populate("userId", "fullName")
      .populate("restaurantId", "restaurantName");
    if (!messages) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "messages not found",
        result: {},
      });
    }
    return res.send({
      statusCode: 200,
      success: true,
      message: "Messages retrieved successfully",
      result: messages,
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: `Internal Server Error: ${error.message}`,
      result: {},
    });
  }
};
