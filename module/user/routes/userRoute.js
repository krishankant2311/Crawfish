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
route.post("/change-password",verifyJWT,upload.none(),userController.changePassword )
route.post("/update-profile",verifyJWT,upload.single('profilePhoto'),userController.updateUserProfile)
route.post("/logout",verifyJWT,upload.none(),userController.logout)
route.get("/getall-user",verifyJWT,upload.none(),userController.getAllUser)
route.get("/getallActive-user",verifyJWT,upload.none(),userController.getAllActiveUser)
route.get("/getRecent-user",verifyJWT,upload.none(),userController.getAllRecentUser)
route.post("/resend-otp",upload.none(),userController.resendOTP)
route.post("/delete-user",verifyJWT,upload.none(),userController.deleteUser)
route.post("/delete-user-byAdmin/:userId",verifyJWT,upload.none(),userController.deleteUserByAdmin)
route.post("/save-location/:userId",verifyJWT,upload.none(),userController.saveLocation)
route.post("/update-userStatus/:userId",verifyJWT,upload.none(),userController.handleStatus)
route.get("/get-profile/:userId",verifyJWT,upload.none(),userController.getprofile)
route.get("/get-profile-byUser",verifyJWT,upload.none(),userController.getprofilebyUser)
route.get("/get-language",verifyJWT,upload.none(),userController.getCurrentlanguage)
route.post("/change-language",verifyJWT,upload.none(),userController.changeUserLanguage)
route.get("/get-user-dashboard",verifyJWT,upload.none(),userController.getUserDashboard);
route.post("/blocked-user/:userId",verifyJWT,upload.none(),userController.BlockedUser);
route.post("/sendOtp-byNumber",upload.none(),userController.sendOTPbyNumber);
route.post("/sendOtp-byNumber-for-fogottPassword",upload.none(),userController.sendOTPbyNumber);
route.post("/change-appmode",verifyJWT,upload.none(),userController.appMode);


// const users = await User.find({status : "Active"}).sort({"createdAt" : -1}).skip(skip).limit(limit)
module.exports = route;