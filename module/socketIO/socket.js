const Message = require("../../module/socketIO/model/socketIOModel");
const User = require("../user/model/userModel")
const Restaurant = require("../restaurants/model/restaurantModel")
const jwt = require("jsonwebtoken");
const Conversation = require("../socketIO/model/conversationModel")

module.exports = function (io) {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.headers.token;
      if (!token) {
        return next(new Error("Token is missing"));
      }
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          let mssgCode = "Invalid Token";
          if (err.message === "jwt expired") {
            mssgCode = "Token expired";
          }
          return next(new Error(mssgCode));
        }
        socket.token = decoded;
        socket.userId = decoded._id;
        return next();
      });
    } catch (error) {
      return next(error);
    }
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 🟢 User joins a chat room
    socket.on("joinRoom", async ({ userId, restaurantId }) => {
      if (!userId || !restaurantId) {
        console.error("Invalid room join request:", { userId, restaurantId });
        return socket.emit("error", {
          statusCode: 400,
          success: false,
          message: "Group ID is required.",
          result: {},
        });
      }
      const user = await User.findOne({
        _id: userId,
        status: "Active",
      });
      if (!user) {
        return socket.emit("error", {
          statusCode: 404,
          success: false,
          message: "user not found",
          result: {},
        });
      }
      const restaurant = await Restaurant.findOne({
        _id: restaurantId,
        status: "Active",
      });
      if (!restaurant) {
        return socket.emit("error", {
          statusCode: 404,
          success: false,
          message: "restaurant not found",
          result: {},
        });
      }
      const room = `${userId}_${restaurantId}`;
      socket.join(room);
      console.log(`User ${userId} joined room ${room}`);
    });

    // 🟢 Handle messages
    socket.on("sendMessage", async ({ userId, restaurantId, message }) => {
      if (!message || message.trim() === "") {
        // return socket.emit("error", { message: "Message cannot be empty" });
        return socket.emit("error", {
          statusCode: 400,
          success: false,
          message: "Message cannot be empty",
          result: {},
        });
      }

      try {
        const newMessage = new Message({ userId, restaurantId, message });
        // console.log("nsjvn ",newMessage)
        await newMessage.save();



        const room = `${userId}_${restaurantId}`;
        io.to(room).emit("receiveMessage", { userId, message });

        // Send confirmation to sender
        socket.emit("messageSent", { success: true, message });
        //  

      } catch (error) {
        console.error("Error saving message:", error);
        // socket.emit("error", { message: "Failed to send message" });
          return socket.emit("error", {
          statusCode: 400,
          success: false,
          message: "Failed to send message",
          result: {},
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};


