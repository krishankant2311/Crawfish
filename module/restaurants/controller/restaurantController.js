// const express =require('express')
// require("dotenv").config()
const validator = require("validator");
const Restaurant = require("../model/restaurantModel");
const { generateJWT } = require("../../../middlewares/jwt");
const genrateOTP = require("../../../helpers/genrateOTP");
const sendEmail = require("../../../mail/mailSender");
const emailVerification = require("../../../templates/emailVerification");
const address = require("../../address/model/addressModel");
// const restaurantModel = require('../model/restaurantModel');
const bcrypt = require("bcryptjs");
const Admin = require("../../admin/model/adminModel");
const User = require("../../user/model/userModel");
const CryptoJS = require("crypto-js");
// const jwt = require("jsonwebtoken")
const path = require("path");
const upload = require("../../../middlewares/multer");
const multer = require("multer");
const { log } = require("console");
// const { log } = require("console");
// const multer = require("../../../middlewares/multer")
const isEmailValid = (email) => {
  return validator.isEmail(email);
};

const isPasswordValid = (password, newPassword) => {
  return validator.isStrongPassword(password, newPassword, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
};

exports.signupRestaurant = async (req, res) => {
  try {
    let { restaurantName, email, password, phoneNumber } = req.body;
    email = email?.trim()?.toLowerCase();
    password = password?.trim();
    restaurantName = restaurantName?.trim();
    if (!restaurantName) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required restaurantName",
        result: {},
      });
    }

    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required email",
        result: {},
      });
    }

    if (!isEmailValid(email)) {
      return res.json({
        statusCode: 400,
        success: false,
        message: " Please enter a valid email",
        result: {},
      });
    }

    if (!password) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required password",
        result: {},
      });
    }

    if (!isPasswordValid(password)) {
      return res.json({
        success: false,
        status: 400,
        message:
          "Password should have contain min 8 digits and atlest 1 capital letter and 1 symbol ",
        result: {},
      });
    }

    // if(password!==confirmPassword){
    //     return res.json({
    //         success: false,
    //         status: 400,
    //         message: "Passwords do not match"
    //     })
    // }
    if (!phoneNumber) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required phone number",
      });
    }
    // if(phoneNumber.length !== 10){
    //   return res.send({
    //     statusCode:400,
    //     success:false,
    //     message:"Phone number must be 10 digits",
    //     result:{}
    //   })
    // }

    //check if email already exists
    const restaurant = await Restaurant.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
      status: { $ne: "Delete" }, // 🟡 Ignore 'Delete' status restaurant
    });
    const ene_password = bcrypt.hashSync(password, 10);
    // console.log("jgfejyewg"+restaurant)
    if (restaurant) {
      if (restaurant.status === "Pending") {
        restaurantName = restaurantName || restaurant.restaurantName;
        email = email || restaurant.email;
        password = restaurant.password;
        phoneNumber = phoneNumber || restaurant.phoneNumber;
        restaurant.status = "Pending";
        const { otpValue, otpExpiry } = genrateOTP();
        const resName = restaurant.restaurantName;
        const title = "Signup OTP";
        const body = emailVerification(otpValue, resName);
        restaurant.otp = {
          otpValue,
          otpExpiry,
        };
        await sendEmail(title, restaurant.email, body);
        await restaurant.save();
        return res.send({
          statusCode: 200,
          success: true,
          message: "Restaurant created successfully",
          result: { otpValue },
        });
      }
      if (restaurant.status === " Block") {
        return res.send({
          statusCode: 400,
          success: false,
          message: "restaurant has been blocked",
          result: {},
        });
      }
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant already exist",
        result: {},
      });
    }

    // const ene_password = bcrypt.hashSync(password, 10);
    const createNewRestaurant = new Restaurant({
      restaurantName: restaurantName,
      email,
      password: ene_password,
      phoneNumber,
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      status: "Pending",
    });

    //generate OTP
    const { otpValue, otpExpiry } = genrateOTP();
    const resName = createNewRestaurant.restaurantName;
    const title = "Signup OTP";
    const body = emailVerification(otpValue, resName);
    createNewRestaurant.otp = {
      otpValue,
      otpExpiry,
    };
    await sendEmail(title, createNewRestaurant.email, body);

    await createNewRestaurant.save();

    return res.send({
      statusCode: 200,
      success: true,
      message:
        "otp generate successfully and restaurant created please verify otp",
      result: { otpValue },
    });
  } catch (error) {
    return res.json({
      statusCode: 500,
      success: false,
      message: error.message + "error in signup restaurant API. ",
    });
  }
};

exports.signupRestaurantVerifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = email?.trim()?.toLowerCase();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required email",
        result: {},
      });
    }
    if (!isEmailValid(email)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please enter a valid email",
        result: {},
      });
    }
    if (!otp) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required OTP",
        result: {},
      });
    }
    if (otp.length !== 4) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "otp must be 4 digits",
        result: {},
      });
    }

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (otp !== restaurant.otp.otpValue) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "invalid otp",
        result: {},
      });
    }
    if (Date.now() > restaurant.otp.otpExpiry) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "otp has expired",
        result: {},
      });
    }
    restaurant.status = "Active";
    restaurant.otp = { otpValue: "", otpExpiry: "" };
    const token = await generateJWT({
      _id: restaurant._id,
      email: restaurant.email,
    });

    const saveUser = await restaurant.save();
    if (saveUser) {
      return res.send({
        statusCode: 200,
        success: true,
        message: "otp verify successfully",
        result: {token},
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 400,
      success: false,
      message: error.message + " ERROR in restaurant signup verify OTP",
      result: {},
    });
  }
};

exports.loginRestaurant = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.toLowerCase()?.trim();
    password = password?.trim();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required email",
        result: {},
      });
    }
    if (!isEmailValid(email)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please enter a valid email",
        result: {},
      });
    }
    if (!isPasswordValid(password)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "please enter a valid password",
        result: {},
      });
    }
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: 400,
        message: "restaurant has deleted",
        result: {},
      });
    }
    if (restaurant.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive Restaurant",
        result: {},
      });
    }
    const dec_password = await bcrypt.compare(password, restaurant.password);
    if (!dec_password) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "wrong password",
        result: {},
      });
    }
    const token = await generateJWT({
      _id: restaurant._id,
      email: restaurant.email,
    });
    restaurant.token = token;

    await restaurant.save();

    return res.send({
      statusCode: 200,
      success: true,
      message: "restaurant login successfully",
      result: { token },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in login restaurant API",
      result: {},
    });
  }
};

exports.editRestaurant = async (req, res) => {
  try {
    // owner token
    let token = req.token;
    let { email, restaurantName, phoneNumber } = req.body;
    email = email?.trim()?.toLowerCase();
    restaurantName = restaurantName?.trim();
    if (!restaurantName) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurantName required",
        result: {},
      });
    }
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "email required",
        result: {},
      });
    }
    if (!isEmailValid(email)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "please enter the valid email",
        result: {},
      });
    }
    if (!phoneNumber) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "phoneNumber required",
        result: {},
      });
    }
    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been deleted",
        result: {},
      });
    }
    if (restaurant.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant has been blocked",
        result: {},
      });
    }
    if (restaurant.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "inactive restaurant",
        result: {},
      });
    }
    // if (restaurant.token !== token) {
    //   return res.send({
    //     statusCode:400,
    //     success:false,
    //     message:"token has expired",
    //     result:{}
    //   })
    // }
    restaurant.restaurantName = restaurantName;
    restaurant.email = email;
    restaurant.phoneNumber = phoneNumber;
    // restaurant.status = "Active";
    restaurant.save();

    return res.send({
      statusCode: 200,
      success: true,
      message: "Restaurant edit successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " Error in edit restaurant API",
      result: {},
    });
  }
};
exports.deleteRestaurant = async (req, res) => {
  try {
    let token = req.token;
    let { resId } = req.params;

    const admin = await Admin.findOne({ _id: token._id });

    // const restaurant = await Restaurant.findOne({ _id: token._id });
    // console.log("admin : " + admin,"restaurant :" + restaurant);

    if (!admin) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin not found",
        result: {},
      });
    }
    if (admin.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin already deleted",
        result: {},
      });
    }
    if (admin.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin inactive",
        result: {},
      });
    }
    const restaurant = await Restaurant.findOne({ _id: resId });
    if (!restaurant) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant already deleted",
        result: {},
      });
    }
    if (restaurant.status == "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive restaurant",
        result: {},
      });
    }
    if (restaurant.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant inactive",
        result: {},
      });
    }

    restaurant.status = "Delete";
    await restaurant.save();

    return res.send({
      statusCode: 200,
      success: true,
      message: "Restaurant deleted successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in delete restaurant API",
    });
  }
};
exports.getRestaurant = async (req, res) => {
  try {
    let token = req.token;
    const restaurant = await Restaurant.findOne({ _id: token._id }).select(
      "-token -otp -password -securityToken"
    );
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant has been deleted",
        result: {},
      });
    }
    if (restaurant.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    return res.send({
      statusCode: 200,
      success: true,
      message: "restaurant get successfully",
      result: { restaurant },
    });
  } catch (error) {
    return res.send({
      statusCode: 400,
      success: false,
      message: error.message + " ERROR in get restaurant API",
      result: {},
    });
  }
};
exports.forgetPassword = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.toLowerCase()?.trim();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email required",
        result: {},
      });
    }
    // if (!isValidEmail(email)) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "please enter a valid emaail",
    //     result: {},
    //   });
    // }
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    const { otpValue, otpExpiry } = genrateOTP();
    const restaurantName = restaurant.restaurantName;
    const title = "Otp for forgotted password";
    const body = emailVerification(otpValue, restaurantName);

    if (restaurant && restaurant.email) {
      await sendEmail(title, restaurant.email, body);
    }

    restaurant.otp = { otpValue, otpExpiry };

    console.log("otp = " + restaurant.otp);

    await restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "otp send successfully",
      result: { otpValue },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "Error in restaurant forget password api ",
      result: {},
    });
  }
};
exports.resendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    // email= email?.toLowerCase()
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required email",
        result: {},
      });
    }
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (
      restaurant.otp.otpExpiry &&
      Date.now() < restaurant.otp.otpExpiry - 5 * 60 * 1000 + 30 * 1000
    ) {
      return res.send({
        success: false,
        statusCode: 500,
        message: "please wait!!, request after 30 sec",
      });
    }
    const { otpValue, otpExpiry } = genrateOTP();
    const restaurantName = restaurant.restaurantName;
    const title = "Otp for forgotted password";
    const body = emailVerification(otpValue, restaurantName);

    if (restaurant && restaurant.email) {
      await sendEmail(title, restaurant.email, body);
    }

    restaurant.otp = { otpValue, otpExpiry };

    console.log("otp = " + restaurant.otp);

    await restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "otp Resend successfully",
      result: { otpValue },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in resent restaurant api",
      result: {},
    });
  }
};

exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = email?.trim()?.toLowerCase();
    otp = otp?.trim();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required email",
        result: {},
      });
    }
    if (!isEmailValid(email)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Please enter a valid email",
        result: {},
      });
    }
    if (!otp) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required otp",
        result: {},
      });
    }
    if (otp.length !== 4) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "otp should be 4 digits number",
        result: {},
      });
    }
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been deleted",
        result: {},
      });
    }
    if (restaurant.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive restaurant",
        result: {},
      });
    }
    if (restaurant.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been blocked",
        result: {},
      });
    }
    if (otp !== restaurant.otp.otpValue) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Incorrect Otp",
        result: {},
      });
    }
    if (restaurant.otp.otpExpiry <= Date.now()) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Otp has expired",
        result: {},
      });
    }
    restaurant.otp.otpValue = "";
    restaurant.otp.otpExpiry = "";

    const securityToken = CryptoJS.lib.WordArray.random(16).toString(
      CryptoJS.enc.Hex
    );

    restaurant.securityToken = securityToken;

    await restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "otp verify successfully",
      result: { securityToken },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in verify forgot password api",
      result: {},
    });
  }
};

exports.updateForgotPassword = async (req, res) => {
  try {
    let { email, newPassword, confirmPassword, securityToken } = req.body;
    email = email?.trim()?.toLowerCase();
    newPassword = newPassword?.trim();
    confirmPassword = confirmPassword?.trim();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        messagfe: "Required email",
        result: {},
      });
    }
    if (!newPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "new password required",
        result: {},
      });
    }
    if (!isPasswordValid(newPassword)) {
      return res.send({
        statusCode: 400,
        success: false,
        message:
          "password must be 8 digits and should contain atleast one capital letter nd one symbol",
        result: {},
      });
    }
    if (!confirmPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required confirm password",
        result: {},
      });
    }

    if (newPassword !== confirmPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "confirm password must be same as new password",
        result: {},
      });
    }
    if (!securityToken) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "required security token",
        result: {},
      });
    }

    const restaurant = await Restaurant.findOne({
      email,
      securityToken: securityToken,
    });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        messsage: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been deleted",
        result: {},
      });
    }
    if (restaurant.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive restaurant",
        result: {},
      });
    }
    if (restaurant.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been blocked",
        result: {},
      });
    }
    const isMatch = await bcrypt.compare(newPassword, restaurant.password);
    if (isMatch) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "New password can not be same as old password",
        result: {},
      });
    }
    const ene_password = bcrypt.hashSync(newPassword, 10);
    restaurant.password = ene_password;
    restaurant.securityToken = "";
    restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "password reset successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in forgotted password API",
      result: {},
    });
  }
};

exports.personalDetails = async (req, res) => {
  try {
    let token = req.token;
    let { fullAddress, city, country } = req.body;
    let restaurantLogo = req.file ? req.file.path : null;
    if (!fullAddress) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required full address",
        result: {},
      });
    }
    if (!city) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required city",
        result: {},
      });
    }
    if (!country) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required country",
        result: {},
      });
    }

    // if (!restaurantLogo) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "Restaurant logo is required",
    //     result: {},
    //   });
    // }

    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant not found",
        result: {  },
      });
    }
    if (
      restaurant.status === "Delete" ||
      restaurant.status === "Block" ||
      restaurant.status === "Pending"
    ) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive restaurant",
        result: {},
      });
    }
    restaurant.fullAddress = fullAddress;
    restaurant.city = city;
    restaurant.country = country;
    if (restaurantLogo) {
      restaurant.restaurantLogo = restaurantLogo;
    }
    await restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Personal details add successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message,
      result: {},
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    let token = req.token;
    let { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required old Password",
        result: {},
      });
    }
    if (!newPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required new Password",
        result: {},
      });
    }
    if (!confirmPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required confirm Password",
        result: {},
      });
    }
    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (
      restaurant.status === "Delete" ||
      restaurant.status === "Pending" ||
      restaurant.status === "Block"
    ) {
      i;
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive restaurant",
        result: {},
      });
    }
    const issame = await bcrypt.compare(oldPassword, restaurant.password);
    if (!issame) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Incorrect old password",
        result: {},
      });
    }
    if (oldPassword == newPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "new password must be different as an old password",
        result: {},
      });
    }
    if (newPassword !== confirmPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "confirm password must be same as new password",
        result: {},
      });
    }
    const ene_password = bcrypt.hashSync(newPassword, 10);

    if (!ene_password) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "password didn't hash",
        result: {},
      });
    }

    restaurant.password = ene_password;
    await restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "password change successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in change password api of restaurant",
      result: {},
    });
  }
};

exports.restaurantProfile = async (req, res) => {
  try {
    let token = req.token;

    let {
      restaurantName,
      // phoneNumber,
      website,
      businessHour,
      description,
      
      // restaurantLogo,
    } = req.body;
    let restaurantLogo = req.file ? req.file.path : null;


    if (!restaurantName) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "required restaurant name",
        result: {},
      });
    }
    // if (!phoneNumber) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "Required phone number",
    //     result: {},
    //   });
    // }
    if (!businessHour) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required business hours",
        result: {},
      });
    }
    if (!description) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required description",
        result: {},
      });
    }
    // if (!restaurantMenu) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "required restaurant menu",
    //     result: {},
    //   });
    // }
    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been deleted",
        result: {},
      });
    }
    if (restaurant.status === "Pending" || restaurant.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive restaurant",
        result: {},
      });
    }
    restaurant.restaurantName = restaurantName;
    // restaurant.phoneNumber = phoneNumber;
    restaurant.website = website;
    restaurant.businessHour = businessHour;
    restaurant.description = description;
    // restaurant.restaurantProfile = restaurantProfile;
    if (restaurantLogo) {
      restaurant.restaurantLogo = restaurantLogo;
    await restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "restaurant profile updated",
      result: {},
    });
  }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in restaurant profile API",
    });
  }
};

exports.uploadMenu = async (req, res) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "./public/menus");
      },
      filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });

    const upload = multer({
      storage,
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== ".pdf") {
          return cb(new Error("Only PDF files are allowed"), false);
        }
        cb(null, true);
      },
    }).single("menu"); // Ensure the field name is 'menu'

    const token = req.token;
    const menu = req.body;

    if (!menu) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Menu required",
        result: {},
      });
    }

    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant not found",
        result: {},
      });
    }

    if (restaurant.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant has been deleted",
        result: {},
      });
    }

    if (restaurant.status === "Block" || restaurant.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive restaurant",
        result: {},
      });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.send({
          statusCode: 400,
          success: false,
          message: err.message,
          result: {},
        });
      }

      if (!req.file) {
        return res.send({
          statusCode: 400,
          success: false,
          message: "No file uploaded",
          result: {},
        });
      }

      const filePath = req.file.path;
      restaurant.menu = filePath;
      await restaurant.save();

      return res.send({
        statusCode: 200,
        success: true,
        message: "Menu uploaded successfully",
        result: { filePath },
      });
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in upload menu API",
      result: { error },
    });
  }
};

exports.getMenu = async (req, res) => {
  try {
    let token = req.token;
    let { resId } = req.params;
    if (!resId) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required restaurant Id",
        result: {},
      });
    }
    const user = await User.findOne({ _id: token._id });
    // if(!user){
    //   return res.send({
    //     statusCode:400,
    //     success:false,
    //     message:"user not found",
    //     result:{}
    //   })
    // }

    const admin = await Admin.findOne({ _id: token._id });
    if (!(user || admin)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    // if (user.status === "Delete") {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "user has been deleted",
    //     result: {}
    //   });
    // }

    // if (user.status === "Block" || user.status === "Pending") {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "Inactive user",
    //     result: {}
    //   });
    // }

    // if (admin.status === "Delete") {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "admin has been deleted",
    //     result: {}
    //   });
    // }

    // if (admin.status === "Block" || admin.status === "Pending") {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "Inactive admin",
    //     result: {}
    //   });
    // }
    const restaurant = await Restaurant.findOne({ _id: resId });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }

    if (restaurant.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant has been deleted",
        result: {},
      });
    }

    if (restaurant.status === "Block" || restaurant.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive restaurant",
        result: {},
      });
    }
    const menu = restaurant.menu;

    if (menu) {
      return res.send({
        statusCode: 200,
        success: true,
        message: "menu get successfully",
        result: { menu },
      });
    }
    return res.send({
      statusCode: 400,
      success: false,
      message: "menu not found",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get menu api",
      result: {},
    });
  }
};
exports.deleteMenu = async (req, res) => {
  try {
    let token = req.token;
    // let { resId } = req.params;
    // if (!resId) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "address id required",
    //     result: {},
    //   });
    // }

    // const admin = await Admin.findOne({ _id: token._id,status:"Active" });
    // if (!admin) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "unauthorise access",
    //     result: {},
    //   });
    // }
    // if (admin.status == "delete") {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "user has been deleted",
    //     result: {},
    //   });
    // }
    // if (admin.status == "Block") {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "user has blocked",
    //     result: {},
    //   });
    // }
    // if (admin.status == "Pending") {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "Inactive",
    //     result: {},
    //   });
    // }

    const restaurant = await Restaurant.findOne({
      _id: token._id,
      status: "Active",
    });

    // console.log(restaurant,admin)
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been deleted",
        result: {},
      });
    }
    if (restaurant.menu == "") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant menu has been already delted",
        result: {},
      });
    }

    restaurant.menu = "";

    await restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "restaurant menu deleted successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in delete menu API",
      result: {},
    });
  }
};
exports.logout = async (req, res) => {
  try {
    let token = req.token;
    let _id = token._id;
    // console.log("id",_id);

    if (!_id) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "required id",
        result: {},
      });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      token._id,

      { $set: { logOut: Date.now() } },
      { new: true }
    );
    if (
      restaurant.status === "Delete" ||
      restaurant.status === "Block" ||
      restaurant.status === "Pending"
    ) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive restaurant",
        result: {},
      });
    }
    if (restaurant.token == "") {
      return res.send({
        statusCode: 400,
        success: false,
        message: " restaurant already logout",
        result: {},
      });
    }

    if (restaurant) {
      restaurant.token = "";
      restaurant.save();
      return res.send({
        statusCode: 200,
        success: true,
        message: "restaurant logout successfully",
        result: {},
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "Error in user logout API",
      result: {},
    });
  }
};

exports.getAllActiverestaurant = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;

    const user = await User.findOne({ _id: token._id, status: "Active" });
    const admin = await Admin.findOne({ _id: token._id, status: "Active" });
    if (!(admin || user)) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized access",
        result: {},
      });
    }

    const allRestaurant = await Restaurant.find({ status: "Active" })
      .select("-otp -securityToken -password -token -phoneNumber ")
      .skip(skip)
      .limit(limit);

    const totalRestaurant = await Restaurant.countDocuments({
      status: "Active",
    });

    return res.send({
      statusCode: 200,
      success: true,
      message: "All Restaurant get successfully",
      result: {
        Restaurant: allRestaurant,
        currentPage: page,
        totalPage: Math.ceil(totalRestaurant / limit),
        totalRecord: totalRestaurant,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " Error in getall active restaurant api",
      result: error,
    });
  }
};

exports.getAllRestaurantbyAdmin = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;
    // const user = await User.findOne({_id: token._id, status: "Active"})
    const admin = await Admin.findOne({ _id: token._id, status: "Active" });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized access",
        result: {},
      });
    }
    const allRestaurant = await Restaurant.find().skip(skip).limit(limit);
    const totalRestaurant = await Restaurant.countDocuments();
    return res.send({
      statusCode: 200,
      success: true,
      message: "All Restaurant get successfully",
      result: {
        Restaurant: allRestaurant,
        currentPage: page,
        totalPage: Math.ceil(totalRestaurant / limit),
        totalRecord: totalRestaurant,
      },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get all restaurant api",
    });
  }
};

exports.getAllRestaurant = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;

    const user = await User.findOne({ _id: token._id, status: "Active" });
    const admin = await Admin.findOne({ _id: token._id, status: "Active" });
    if (!(admin || user)) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized access",
        result: {},
      });
    }

    const allRestaurant = await Restaurant.find({ status: "Active" })
      .select("-otp -password -phoneNumber -token -securityToken ")
      .skip(skip)
      .limit(limit);

    const totalRestaurant = await Restaurant.countDocuments({
      status: "Active",
    });

    return res.send({
      statusCode: 200,
      success: true,
      message: "All Restaurant get successfully",
      result: {
        Restaurant: allRestaurant,
        currentPage: page,
        totalPage: Math.ceil(totalRestaurant / limit),
        totalRecord: totalRestaurant,
      },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get all restaurant api",
    });
  }
};
exports.topRatedRestaurant = async (req, res) => {
  try {
    let token = req.token;
    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status === "Delete") {
      return res.send({
        statusCode,
        success: false,
        message: "user has been deleted",
        result: {},
      });
    }
    if (user.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    if (user.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    const restaurant = await Restaurant.find({ status: "Active" })
      .sort({ rating: -1 })
      .limit(10)
      .select("-password  -token -securityToken -phoneNumber -otp ");
    if (!restaurant) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Restaurant not found",
        result: {},
      });
    }
    // console.log(restaurant);

    return res.send({
      statusCode: 200,
      success: true,
      message: "top rated restaurant fetch successfully",
      result: { restaurant },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in top rates restaurant",
      result: {},
    });
  }
};

// exports.editRestaurantbyAdmin = async (req,res) => {
//   try {
//     let token = req.token;
//     const {resId} = req.params
//     const {operationalHours, status, isVerified} = req.body;
//     let admin = await Admin.findById({_id:token._id, status:"Active"});

//     if(!admin){
//       return res.send({
//         statusCode:404,
//         success:false,
//         message:"admin not found",
//         result:{}
//       })
//     }if(admin.status === "Delete"){
//       return res.send({
//         statusCode:400,
//         succes:false,
//         message:"unauthorise access",
//         result:{}
//       })
//     }

//     const restaurant = await Restaurant.findById({_id:resId})
//     if(!restaurant){
//       return res.send({
//         statusCode:404,
//         success:false,
//         message:"restaurant not found",
//         result:{}
//       })
//     }
//     if(restaurant.status === "Delete"){
//       return res.send({
//         statusCode:400,
//         success:false,
//         message:"restaurant has been deleted",
//         result:{}
//       })
//     }
//     if(restaurant.status === "Block"){
//       return res.send({
//         statusCode:400,
//         success:false,
//         message:"Restaurant Inactive",
//         result:{}
//       })
//     }
//     restaurant.operationalHours = operationalHours;
//     restaurant.status = status;
//     restaurant.isVerified = isVerified;

//     restaurant.save();
//     return res.send({
//       statusCode:200,
//       success:true,
//       message:"restaurant updated successfully",
//       result:{}
//     })
//   } catch (error) {
//     return res.send({
//       statusCode:500,
//       success:false,
//       message:"ERROR in edit restaurant by admin api " + error.message,
//       result:{}
//     })
//   }
// }

exports.editRestaurantbyAdmin = async (req, res) => {
  try {
    let token = req.token;
    const { resId } = req.params;
    const { status, isVerified } = req.body;
    let admin = await Admin.findById({ _id: token._id });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "admin not found",
        result: {},
      });
    }
    if (admin.status === "Delete") {
      return res.send({
        statusCode: 400,
        succes: false,
        message: "admin is deleted",
        result: {},
      });
    }
    if (admin.status === "Block") {
      return res.send({
        statusCode: 400,
        succes: false,
        message: "admin is blocked",
        result: {},
      });
    }
    const restaurant = await Restaurant.findById({ _id: resId });
    if (!restaurant) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    // if (restaurant.status === "Delete") {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "restaurant has been deleted",
    //     result: {},
    //   });
    // }
    // if (restaurant.status === "Block") {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "Restaurant Inactive",
    //     result: {},
    //   });
    // }
    // restaurant.operationalHours = operationalHours;
    restaurant.status = status;
    restaurant.isVerified = isVerified;
    restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "restaurant updated successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: "ERROR in edit restaurant by admin api " + error.message,
      result: {},
    });
  }
};

exports.BlockedRestaurant = async (req, res) => {
  try {
    let token = req.token;
    let { resId } = req.params;
    const admin = await Admin.findOne({ _id: token._id });
    // const restaurant = await Restaurant.findOne({ _id: token._id });
    // console.log("admin : " + admin,"restaurant :" + restaurant);
    if (!admin) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin not found",
        result: {},
      });
    }
    if (admin.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin already deleted",
        result: {},
      });
    }
    if (admin.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin inactive",
        result: {},
      });
    }
    const restaurant = await Restaurant.findOne({ _id: resId });
    if (!restaurant) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Restaurant already Blocked",
        result: {},
      });
    }
    restaurant.status = "Block";
    await restaurant.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Restaurant Blocked successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in Block restaurant API",
    });
  }
};

exports.getRestaurantDashboard = async (req, res) => {
  try {
    const token = req.token;
    const admin = await Admin.findById({ _id: token._id, status: "Active" });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "admin not found",
        result: {},
      });
    }
    // Get range from query param (today | week | month)
    const range = req.query.range || "month";
    // Date filter logic
    let dateFilter = {};
    const now = new Date();
    if (range === "today") {
      const start = new Date(now.setHours(0, 0, 0, 0));
      const end = new Date(now.setHours(23, 59, 59, 999));
      dateFilter.createdAt = { $gte: start, $lte: end };
    } else if (range === "week") {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      dateFilter.createdAt = { $gte: start };
    } else if (range === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter.createdAt = { $gte: start };
    } else if (range === "custom") {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      endDate.setHours(23, 59, 59, 999); // include full day
      if (!isNaN(startDate) && !isNaN(endDate)) {
        dateFilter.createdAt = { $gte: startDate, $lte: endDate };
      }
    }
    // Filtered stats
    const verified = await Restaurant.countDocuments({
      isVerified: true,
      ...dateFilter,
    });
    const unverified = await Restaurant.countDocuments({
      isVerified: false,
      ...dateFilter,
    });
    const totalRestaurant = await Restaurant.countDocuments(dateFilter);
    // const countryList = await Restaurant.distinct("country", {
    //   country: { $ne: "" },
    //   ...dateFilter,
    // });
    // const totalCountries = countryList.length;
    return res.send({
      statusCode: 200,
      success: true,
      message: "restaurant dashboard fetch successfully",
      result: {
        range,
        verified,
        unverified,
        totalRestaurant,
        // totalCountries,
        // countryList,
      },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get restaurant dashboard api",
      result: {},
    });
  }
};

// const Restaurant = require("../models/Restaurant");
const scrapeGoogleRestaurants = require("../../../scrapping/scrappingGoogleMap"); // You’ll create this

// exports.getNearbyRestaurants = async (req, res) => {
//   await Restaurant.syncIndexes(); // or ensureIndexes()
//   console.log('Indexes created');
//   const { lat, lng } = req.query;

//   if (!lat || !lng) return res.status(400).json({ message: "lat and lng required" });

//   const coords = [parseFloat(lng), parseFloat(lat)];
//   const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);

//   console.log("COORDS", coords, oneDayAgo);

//   // Check existing scraped data
//   const existingRestaurants = await Restaurant.find({
//     location: {
//       $nearSphere: {
//         $geometry: { type: "Point", coordinates: coords },
//         $maxDistance: 3000, // 3 km radius
//       },
//     },
//     isScraped: true,
//     updatedAt: { $gte: oneDayAgo },
//   });

//   // const existingRestaurants = await Restaurant.aggregate([
//   //   {
//   //     $geoNear: {
//   //       near: {
//   //         type: "Point",
//   //         coordinates: coords, // Ensure coords is [longitude, latitude]
//   //       },
//   //       distanceField: "distance",
//   //       maxDistance: 3000, // 3 km radius
//   //       spherical: true,
//   //       query: {
//   //         isScraped: true,
//   //         updatedAt: { $gte: oneDayAgo },
//   //       },
//   //     },
//   //   },
//   //   // You can add more stages like $sort, $limit, etc., if needed
//   // ]);

//   console.log("Existing Restaurants",existingRestaurants)

//   if (existingRestaurants.length) {
//     return res.json(existingRestaurants);
//   }

//   // Scrape new data
//   const scrapedData = await scrapeGoogleRestaurants(lat, lng);

//   const restaurantsToSave = scrapedData.map((r) => ({
//     ...r,
//     email: `scraped_${Math.random().toString(36).substring(7)}@placeholder.com`,
//     password: "scraped_data_only",
//     phoneNumber: "0000000000",
//     address: r.fullAddress || "",
//     status: "Active",
//     isScraped: true,
//     isVerified: false,
//     location: {
//       type: "Point",
//       coordinates: [parseFloat(lng), parseFloat(lat)],
//     },
//   }));

//   for (const r of restaurantsToSave) {
//     await Restaurant.updateOne(
//       { placeId: r.placeId },
//       { $set: r },
//       { upsert: true }
//     );
//   }

//   res.json(restaurantsToSave);
// };

// const scrapeGoogleRestaurants = require("../../scrapping/scrappingGoogleMap"); // adjust the path as needed
// const Restaurant = require("../../models/Restaurant"); // adjust according to your folder structure

// exports.getNearbyRestaurants = async (req, res) => {
//   try {
//     await Restaurant.syncIndexes(); // ensure indexes
//     console.log("Indexes created");

//     const { lat, lng } = req.query;
//     if (!lat || !lng) {
//       return res.status(400).json({ message: "lat and lng required" });
//     }

//     const coords = [parseFloat(lng), parseFloat(lat)];
//     const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
//     console.log("COORDS", coords, oneDayAgo);

//     const existingRestaurants = await Restaurant.find({
//       location: {
//         $nearSphere: {
//           $geometry: { type: "Point", coordinates: coords },
//           $maxDistance: 3000,
//         },
//       },
//       isScraped: true,
//       updatedAt: { $gte: oneDayAgo },
//     });

//     console.log("Existing Restaurants", existingRestaurants.length);

//     if (existingRestaurants.length) {
//       return res.json(existingRestaurants);
//     }

//     // 👇 Scrape new data
//     const scrapedData = await scrapeGoogleRestaurants(lat, lng);

//     const restaurantsToSave = scrapedData.map((r) => ({
//       ...r,
//       email: `scraped_${Math.random().toString(36).substring(7)}@placeholder.com`,
//       password: "scraped_data_only",
//       phoneNumber: "0000000000",
//       address: r.address || "",
//       status: "Active",
//       isScraped: true,
//       isVerified: false,
//       location: {
//         type: "Point",
//         coordinates: [parseFloat(lng), parseFloat(lat)],
//       },
//     }));

//     // 👇 Upsert all restaurants
//     for (const r of restaurantsToSave) {
//       await Restaurant.updateOne(
//         { placeId: r.placeId },
//         { $set: r },
//         { upsert: true }
//       );
//     }

//     res.json(restaurantsToSave);
//   } catch (err) {
//     console.error("Error in getNearbyRestaurants:", err.message);
//     res.status(500).json({ message: "Something went wrong", error: err.message });
//   }
// };

// const scrapeGoogleRestaurants = require('./path-to-your-scrape-function');
// const Restaurant = require('../models/Restaurant'); // Adjust the path if needed

exports.getNearbyRestaurants = async (req, res) => {
  try {
    await Restaurant.syncIndexes(); // Ensure indexes
    console.log("Indexes created");

    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng required" });
    }

    const coords = [parseFloat(lng), parseFloat(lat)];
    const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);

    // 🔍 Check for recently scraped restaurants nearby
    const existingRestaurants = await Restaurant.find({
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: coords },
          $maxDistance: 3000,
        },
      },
      isScraped: true,
      updatedAt: { $gte: oneDayAgo },
    });

    console.log("Existing Restaurants", existingRestaurants.length);

    if (existingRestaurants.length) {
      return res.json(existingRestaurants);
    }

    // 🚀 Scrape from Google if no fresh data
    const scrapedData = await scrapeGoogleRestaurants(lat, lng);

    console.log(scrapedData);

    const restaurantsToSave = scrapedData.map((r) => ({
      ...r,
      email: `scraped_${Math.random()
        .toString(36)
        .substring(7)}@placeholder.com`,
      password: "scraped_data_only",
      phoneNumber: "0000000000",
      address: r.address || "",
      status: "Active",
      isScraped: true,
      isVerified: false,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
    }));

    // 💾 Save or update in DB
    for (const r of restaurantsToSave) {
      await Restaurant.updateOne(
        { placeId: r.placeId },
        { $set: r },
        { upsert: true }
      );
    }

    res.json(restaurantsToSave);
  } catch (err) {
    console.error("Error in getNearbyRestaurants:", err.message);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};


// exports.getAllRestaurantbyRestaurant = async (req, res) => {

//   try {
//     let token = req.token;
//     let { page = 1, limit = 10 } = req.query;
//     page = Number.parseInt(page);
//     limit = Number.parseInt(limit);
//     const skip = (page - 1) * limit;
//     // const user = await User.findOne({_id: token._id, status: "Active"})
//     const restaurant = await Restaurant.findOne({ _id: token._id, status: "Active" });
//     if (!restaurant) {
//       return res.send({
//         statusCode: 404,
//         success: false,
//         message: "Unauthorized access",
//         result: {},
//       });
//     }
//     const allRestaurant = await Restaurant.find().skip(skip).limit(limit);
//     const totalRestaurant = await Restaurant.countDocuments();
//     return res.send({
//       statusCode: 200,
//       success: true,
//       message: "All Restaurant get successfully",
//       result: {
//         Restaurant: allRestaurant,
//         currentPage: page,
//         totalPage: Math.ceil(totalRestaurant / limit),
//         totalRecord: totalRestaurant,
//       },
//     });
//   } catch (error) {
//     return res.send({
//       statusCode: 500,
//       success: false,
//       message: error.message + " ERROR in get all restaurant api",
//     });
//   }
// };

exports.NearmeAndTopratedrestaurant = async(req,res) => {
  try {
    let token = req.token;
    // let {lat,lng} = req.boby;

    const user = await User.findOne({_id:token._id, status:"Active"})
    if(!user){
      return res.send({
        statusCode:404,
        success:false,
        message:"user not found",
        result:{}
      })
    }

    const nearMeRestaurants = await Restaurant.find({status:"Active"}).limit(6).select("-token -password -phoneNumber")
    if(!nearMeRestaurants){
      return res.send({
        statusCode:404,
        success:false,
        message:"nearme restaurant not found",
        result:{}
      })
    }
    const topRated = await Restaurant.find({status:"Active"}).limit(5).select("-token -password -phoneNumber")
    if(!topRated){
      return res.send({
        statusCode:404,
        success:false,
        message:"top rated restaurant not found",
        result:{}
      })
    }
    return res.send({
      statusCode:200,
      success:true,
      message:"restaurants fetch successfully",
      result:{nearMeRestaurants,topRated}
    })
  } catch (error) {
    return res.send({
      statusCode:500,
      success:false,
      message:error.message + " ERROR in nearme and top rated restaurant api",
      result:{}
    })
  }
}

exports.getRestaurantbyUser = async (req, res) => {
  try {
    let token = req.token;
    let {resId} = req.params;
    let user = await User.findOne({_id: token._id});
    if (!user) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    const restaurant = await Restaurant.findOne({ _id: resId , status :"Active" }).select("-token -password -otp -securityToken ");
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    return res.send({
      statusCode: 200,
      success: true,
      message: "restaurant get successfully",
      result: {restaurant},
    });
  } catch (error) {
    console.log("Error in get restaurant by user");
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get restaurant by user",
      result: {},
    });
  }
}


exports.nearmerestaurants = async(req,res) => {
  try {
    let token = req.token;

    const user = await User.findOne({_id:token._id, status:"Active"})
    if(!user){
      return res.send({
        statusCode:404,
        success:false,
        message:"user not found",
        result:{}
      })
    }

    const restaurant = await Restaurant.find({status:"Active"}).limit(10)
    if(!restaurant){
      return res.send({
        statusCode:404,
        success:false,
        message:"restaurant not found",
        result:{}
      })
    }
    return res.send({
      statusCode:200,
      success:true,
      message:"near by restaurant fetch successfully",
      result:{restaurant}
    })
  } catch (error) {
    return res.send({
      statusCode:500,
      succes:false,
      message:error.message + " ERROR in nearme restaurant api",
      result:{}
    })
  }
}











