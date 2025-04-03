const express = require("express");
// const Message = require("../../socketIO/model/socketIOModel");
// const User = require("../../user/model/userModel")
// const Restaurant = require("../../restaurants/model/restaurantModel")

const {verifyJWT} = require("../../../middlewares/jwt")
const {getMessages,createMessage} = require("../../socketIO/controller/socketController")

const router = express.Router();

// Get messages between User & Restaurant
// router.get("/:userId/and:restaurantId",verifyJWT, async (req, res) => {
//     try {
//     let { userId, restaurantId } = req.params;
//     let token = req.token;
   
    
//         let user = await User.findOne({_id:token._id})
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
//         // if(user.status === "pending" || user.status === "Block"){
//         //     return res.send({
//         //         statusCode:400,
//         //         success:false,
//         //         message:"unauthorise access",
//         //         result:{}
//         //     })
//         // }
//         let restaurant = await Restaurant.findOne({_id:restaurantId})
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
//         // if(restaurant.status==="Block" || restaurant.status==="Pending"){
//         //     return res.send({
//         //         statusCode:400,
//         //         success:false,
//         //         message:"unauthorised access",
//         //         result:{}
//         //     })
//         // }
//       let message = await Message.find({
//         userId: userId,
//         restaurantId: restaurantId
//       })
//         .sort({ createdAt: 1 })
//         .populate("userId", "name") 
//         .populate("restaurantId", "name"); 
      
//         // message.userId = userId;
//         // message.restaurantId=restaurantId;
//         // message=message;

       
//     //   await message.save();
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
// });

router.get("/get-message/:userId/and/:restaurantId", verifyJWT, getMessages);
// router.post("/create-message/:userId/and/:restaurantId", verifyJWT, createMessage);

module.exports = router;
