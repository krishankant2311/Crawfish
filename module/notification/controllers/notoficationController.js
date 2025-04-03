const Notification = require("../../notification/model/notificationModel")
const User = require("../../user/model/userModel")
const Restaurant = require("../../restaurants/model/restaurantModel")
const NotificationSeen = require("../../notificationSeen/model/notificationSeenModel")
const express = require("express")


// const express = require("express");
// const admin = require("firebase-admin");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

// const app = express();
// const PORT = 8000;

// Firebase Admin SDK Config
// const serviceAccount = require("./serviceAccountKey.json");
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// Send Notification to All Users
exports.sendNotification = async (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
        return res.status(400).json({ error: "Title and body are required" });
    }
    
    try {
        const users = await User.find({}, "fcmToken");
        const tokens = users.map(user => user.fcmToken).filter(token => token);
        
        if (tokens.length === 0) {
            return res.status(400).json({ error: "No users found with valid FCM tokens" });
        }
        
        const message = {
            notification: { title, body },
            tokens, // Send to all users
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        res.json({ success: true, response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};



exports.markNotificationSeen = async(req,res)=>{

    try {
        let userId = req.token._id;
    
        let {notificationId} = req.body;
    
        notificationId = notificationId?.trim();
    
        if(!notificationId){
            return res.send({
                statusCode:400,
                success:false,
                message:"notificationId is required",
                result:{}
            })
        }
    
        let notification = await Notification.findById(notificationId);
    
        if(!notification){
    
            return res.send({
    
                statusCode:400,
                success:false,
                message:"Invalid notificationId",
                result:{}
            })
        }

        let query ={};
        query.userId = userId;
        query.notificationId=notificationId
    
       let alreadySeenNotification = await NotificationSeen.findOne(query);

       if(alreadySeenNotification && alreadySeenNotification?.isSeen){

        return res.send({
            statusCode:400,
            success:false,
            message:"notification already marked as seen",
            result:{}
        })
       }
    
       let newNotification = new NotificationSeen({

        notificationId,userId,isSeen:true
       });

       await newNotification.save();

        return res.send({
            statusCode:200,
            success:true,
            message:"notification successfully marked as seen",
            result:{}
        })
    
    } catch (error) {
        
        console.log("error in marking notification as seen",error);

        return res.send({
            statusCode:500,
            success:false,
            message:"Internal Server Error",
            result:{
                error:error.message
            }
        })
        
    }
}



// const User = require("../../user/model/userModel");

exports.updatePreferences = async (req, res) => {
    try {
        let { userId } = req.params;
        let { preferences } = req.body;

        if (!userId) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Required userId",
                result: {}
            });
        }

        if (!preferences || Object.keys(preferences).length === 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Required valid preferences",
                result: {}
            });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
                result: {}
            });
        }

        // ✅ Merge New Preferences with Existing Ones
        user.preferences = { ...user.preferences, ...preferences };
        await user.save();

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Preferences updated successfully",
            result: user.preferences
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: error.message + " ERROR in preference update API",
            result: {}
        });
    }
};


exports.sendNotification =  async (req, res) => {
    const { title, body, type } = req.body;

    if (!title || !body || !type) {
        return res.status(400).json({ error: "Title, body, and type are required" });
    }
    if(!title){
        return res.send({
            statusCode:400,
            success:false,
            message:"required title",
            result:{}
        })
    }

    try {
        let filter = {};
        if (type === "sendTargetNotification") filter["preferences.sendTargetNotification"] = true;
        if (type === "specialOffers") filter["preferences.specialOffers"] = true;
        if (type === "systemChanges") filter["preferences.systemChanges"] = true;

        const users = await User.find(filter, "fcmToken");
        const tokens = users.map(user => user.fcmToken).filter(token => token);

        if (tokens.length === 0) {
            return res.status(400).json({ error: "No users found with selected notification preference" });
        }

        const message = {
            notification: { title, body },
            tokens,
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        res.json({ success: true, response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// for read status 

exports.readStatus = async (req, res) => {
    const { notificationId } = req.body;
    if(!notificationId){
        return res.send({
            statusCode:400,
            success:false,
            message:"Required userId",
            result:{}
        })
    }

    try {
        await Notification.findByIdAndUpdate(notificationId, { status: "read" });
            return res.send({
                statusCode:200,
                success:true,
                message:"status update successfully",
                result:{}
            })
        }     catch (error) {
        return res.send({
            statusCode:500,
            success:false,
            message:error.message + " ERROR in read status api",
            result:{}
        })
    }
}



