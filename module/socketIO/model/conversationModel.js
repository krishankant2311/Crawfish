const mongoose = require("mongoose");

const conversationModel = new mongoose.Schema({
    participants: {
        userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    restaurantId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
        }
    },
    roomId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        default:""
    }]
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationModel);

module.exports = { Conversation };