const express = require("express")

const route = express.Router()
const upload = require('../../../middlewares/multer')

const restaurantController = require("../../restaurants/controller/restaurantController")
const {verifyJWT} = require("../../../middlewares/jwt")


route.post("/signup-restaurant",upload.none(),restaurantController.signupRestaurant)
route.post("/signup-restaurant-verify-otp",upload.none(),restaurantController.signupRestaurantVerifyOtp)
route.post("/login-restaurant",upload.none(),restaurantController.loginRestaurant)
route.post('/edit-restaurant',verifyJWT,upload.none(),restaurantController.editRestaurant)
route.post('/delete-restaurant/:resId',verifyJWT,upload.none(),restaurantController.deleteRestaurant)

route.get('/get-restaurant',verifyJWT,restaurantController.getRestaurant)
route.post('/forgot-password-restaurant',upload.none(),restaurantController.forgetPassword)
route.post('/verify-forgot-password-otp-restaurant',upload.none(),restaurantController.verifyForgotPasswordOtp)
route.post('/update-forgot-password-restaurant',upload.none(),restaurantController.updateForgotPassword)
route.post('/resend-otp-restaurant',upload.none(),restaurantController.resendOTP)
route.post('/personal-details-restaurant',verifyJWT,upload.single('restaurantLogo'),restaurantController.personalDetails)
route.post('/change-password',verifyJWT,upload.none(),restaurantController.changePassword)
route.post('/restaurant-profile',verifyJWT,upload.single('restaurantLogo'),restaurantController.restaurantProfile)
route.post('/upload-menu',verifyJWT,restaurantController.uploadMenu)
route.get('/get-menu/:resId',verifyJWT,restaurantController.getMenu)
route.post('/delete-menu',verifyJWT,restaurantController.deleteMenu)
route.post("/logout",verifyJWT,upload.none(),restaurantController.logout)
route.post("/edit-restaurantByadmin/:resId",verifyJWT,upload.none(),restaurantController.editRestaurantbyAdmin)
route.get('/getall-restaurant',verifyJWT,upload.none(),restaurantController.getAllActiverestaurant)
route.get('/getall-restaurantsbyAdmin',verifyJWT,upload.none(),restaurantController.getAllRestaurantbyAdmin)
route.get("/top-rated-restaurant",verifyJWT,upload.none(),restaurantController.topRatedRestaurant)
route.post("/block-restaurant/:resId",verifyJWT,upload.none(),restaurantController.BlockedRestaurant)
route.get("/get-restaurant-dashboard",verifyJWT,upload.none(),restaurantController.getRestaurantDashboard)
route.get("/get-nearby-restaurant",upload.none(),restaurantController.getNearbyRestaurants)
route.get("/get-nearmeAndToprated-restaurant",verifyJWT,upload.none(),restaurantController.NearmeAndTopratedrestaurant)





module.exports = route