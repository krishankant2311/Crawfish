const mongoose = require("mongoose");
 
const notificationSeenSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant"
    },
    notificationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Notification"
    }
},{timestamps:true})

const NotificationSeen = mongoose.model("NotificationSeen",notificationSeenSchema);

module.exports = NotificationSeen