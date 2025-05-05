const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User ID
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    }, // Restaurant ID
    // senderType: {
    //   type: String,
    //   enum: ["User", "Restaurant"],
    //   // required: true,
    //   default:""
    // },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);
MessageSchema.index({ userId: 1, restaurantId: 1, createdAt: -1 });

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
