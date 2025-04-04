const express = require('express');

const {verifyJWT} = require('../../../middlewares/jwt');
// const userController = require('../controller/userController');
const userController = require('../controller/userController')
const upload = require('../../../middlewares/multer');

const route = express.Router();

route.post("/sign-up",upload.none(),userController.signup)
route.post("/verify-sign-otp",upload.none(),userController.verifysignOTP)
route.post("/login",upload.none(),userController.login)
route.post("/verify-otp",upload.none(),userController.verifyOTP)
route.post("/forgot-password",upload.none(),userController.forgetPassword)
route.post("/update-forgotted-password",upload.none(),userController.updateForgotPassword)
route.post("/change-password",upload.none(),verifyJWT,userController.changePassword )
route.post("/update-profile",verifyJWT,upload.single('profilePhoto'),userController.updateUserProfile)
route.post("/logout",upload.none(),verifyJWT,userController.logout)
route.get("/getall-user",upload.none(),verifyJWT,userController.getAllUser)
route.get("/getallActive-user",upload.none(),verifyJWT,userController.getAllActiveUser)
route.get("/getRecent-user",upload.none(),verifyJWT,userController.getAllRecentUser)
route.post("/resend-otp",upload.none(),userController.resendOTP)
route.post("/delete-user/:userId",verifyJWT,upload.none(),userController.deleteUser)
route.post("/update-userStatus/:userId",verifyJWT,upload.none(),userController.handleStatus)
route.get("/get-profile/:userId",verifyJWT,upload.none(),userController.getprofile)


// const users = await User.find({status : "Active"}).sort({"createdAt" : -1}).skip(skip).limit(limit)
module.exports = route;