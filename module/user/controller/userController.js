const validator = require("validator");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../../../middlewares/jwt");
const generateOTP = require("../../../helpers/genrateOTP");
const sendEmail = require("../../../mail/mailSender");
const CryptoJS = require("crypto-js");
// const templates =require("../../../templates/emailVerification")
const emailVerification = require("../../../templates/emailVerification");
// const qrcode = require("qrcode");
// const crypto = require("crypto");
const Admin = require("../../admin/model/adminModel");
// const numberValidator = require("libphonenumber.js")
const socketIo = require("socket.io");
const Restaurant = require("../../restaurants/model/restaurantModel");
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

const isStrongPassword = (password, newPassword) => {
  const options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumber: 1,
    minSymbol: 1,
  };
  return validator.isStrongPassword(password, newPassword, options);
};

// exports.signup = async (req, res) => {
//   try {
//     let { email, fullName, number, password } = req.body;
//     email = email?.toLowerCase()?.trim();
//     fullName = fullName?.trim();
//     password = password?.trim();
//     number = Number.parseInt(number);
//     if (!email) {
//       return res.send({
//         statuscode: 400,
//         success: false,
//         message: "email required",
//         result: {},
//       });
//     }
//     if (!isValidEmail(email)) {
//       return res.send({
//         statuscode: 400,
//         success: false,
//         message: "invalid email",
//         result: {},
//       });
//     }
//     if (!fullName) {
//       return res.send({
//         statuscode: 400,
//         success: false,
//         message: "fullname required",
//         result: {},
//       });
//     }
//     if (!number) {
//       return res.send({
//         statuscode: 400,
//         success: false,
//         message: "Mo. number required",
//         result: {},
//       });
//     }
//     if (!password) {
//       return res.send({
//         statuscode: 400,
//         success: false,
//         message: "password required",
//         result: {},
//       });
//     }
//     if (!isStrongPassword(password)) {
//       return res.send({
//         statuscode: 400,
//         success: false,
//         message:
//           "password should be 8 digits and must contain atleast 1 capital letter and 1 symbol",
//         result: {},
//       });
//     }
//     const { otpValue, otpExpiry } = generateOTP();
//     console.log(otpValue, otpExpiry);
//     const name = fullName;
//     const sub = "sign up verification";
//     const html = emailVerification(otpValue, name);

//     const user = await User.findOne({ email });

//     // const mailSend = sendEmail(sub, email, html);
//     // if (!mailSend) {
//     //   return res.send({
//     //     statusCode: 400,
//     //     success: false,
//     //     message: "otp didn't send",
//     //     result: { otpValue },
//     //   });
//     // }

//     const ene_password = bcrypt.hashSync(password, 10);

//     if (user) {

//       if (user.status === "Delete") {
//         user.email = email;
//         user.fullName = fullName;
//         user.password = ene_password;
//         user.number = number;
//         user.otp.otpValue = otpValue;
//         user.otp.otpExpiry = otpExpiry;
//         user.status = "Pending";
//         await user.save();

//         const mailSend = sendEmail(sub, email, html);
//         if (!mailSend) {
//           return res.send({
//             statusCode: 400,
//             success: false,
//             message: "otp didn't send",
//             result: {  },
//           });
//         }

//         return res.send({
//           statusCode: 200,
//           success: true,
//           message: "user created successfully",
//           result: { otpValue },
//         });
//       }

//       return res.send({
//         statuscode: 404,
//         success: false,
//         message: "user already exist",
//         result: { otpValue },
//       });
//     }
//     // console.log(user);

//     // const { otpValue, otpExpiry } = generateOTP();
//     // console.log(otpValue, otpExpiry);
//     // const name = fullName;
//     // const sub = "sign up verification";
//     // const html = emailVerification(otpValue, name);

//     // let { otpValue, otpExpiry } = generateOTP();
//     // const name = fullName;
//     // const title = "Forget Password otp";
//     // const body = emailVerification(otpValue, name);
//     // user.otp = {
//     //   otpValue,
//     //   otpExpiry,
//     // };
//     // console.log("hgfeyj"+ user.otp);
//     // // if (admin && admin.email) {
//     //   await sendEmail(title, email, body);
//     // // }

//     // const mailSend = sendEmail(sub, email, html);
//     // if (!mailSend) {
//     //   return res.send({
//     //     statusCode: 200,
//     //     success: true,
//     //     message: "otp didn't send",
//     //     result: { otpValue },
//     //   });
//     // }

//     // const ene_password = bcrypt.hashSync(password, 10);
//     const createNewUser = new User({
//       email,
//       fullName,
//       password: ene_password,
//       number: number,
//       otp: {
//         otpValue: otpValue,
//         otpExpiry: otpExpiry,
//       },
//     });

//     await createNewUser.save();
//     return res.send({
//       statuscode: 200,
//       success: true,
//       message: "user created and otp send successfully",
//       result: {otpValue},
//     });
//   } catch (error) {
//     return res.send({
//       statuscode: 500,
//       success: false,
//       message: error.message + " Error in user signuo API ",
//       result: {},
//     });
//   }
// };

exports.signup = async (req, res) => {
  try {
    let { email, fullName, number, password } = req.body;
    email = email?.toLowerCase()?.trim();
    fullName = fullName?.trim();
    password = password?.trim();
    number = number?.trim();
    // number = Number.parseInt(number);

    if (!email)
      return res.send({
        statuscode: 400,
        success: false,
        message: "email required",
        result: {},
      });
    if (!isValidEmail(email))
      return res.send({
        statuscode: 400,
        success: false,
        message: "invalid email",
        result: {},
      });
    if (!fullName)
      return res.send({
        statuscode: 400,
        success: false,
        message: "fullname required",
        result: {},
      });
    if (!number){
      return res.send({
        statuscode: 400,
        success: false,
        message: "Mo. number required",
        result: {},
      });
    }
    console.log(number.length)
      if (number.length !== 10) {
        return res.send({
          statusCode: 400,
          success: false,
          message: "Mobile number must be 10 digits.",
          result: {},
        });
      }
    if (!password){
      return res.send({
        statuscode: 400,
        success: false,
        message: "password required",
        result: {},
      });
    }
    if (!isStrongPassword(password)) {
      return res.send({
        statuscode: 400,
        success: false,
        message:
          "password should be 8 digits and must contain atleast 1 capital letter and 1 symbol",
        result: {},
      });
    }

    const user = await User.findOne({$or:[{email:email},{number:number}] } );
    const ene_password = bcrypt.hashSync(password, 10);

    // ✅ User exists
    if (user) {
      // if(user.status === "Pending" || user.status === "Block" || user.status === "Active"){
      //   return res.send({
      //     statusCode:400,
      //     success:false,
      //     message:"user already exist",
      //     result:{}
      //   })
      // }
      if (user.status === "Delete") {
        // Generate OTP only here
        const { otpValue, otpExpiry } = generateOTP();
        const html = emailVerification(otpValue, fullName);
        const sub = "Sign Up Verification";

        user.fullName = fullName;
        user.password = ene_password;
        user.number = number;
        user.email = email;
        user.otp = { otpValue, otpExpiry };
        user.status = "Pending";
        await user.save();

        const mailSend = await sendEmail(sub, email, html);
        if (!mailSend) {
          return res.send({
            statusCode: 400,
            success: false,
            message: "OTP didn't send",
            result: {},
          });
        }

        return res.send({
          statusCode: 200,
          success: true,
          message: "User re-registered. OTP sent",
          result: { otpValue },
        });
      }
      if (user.status === "Pending") {
        // Generate OTP only here
        const { otpValue, otpExpiry } = generateOTP();
        const html = emailVerification(otpValue, fullName);
        const sub = "Sign Up Verification";

        user.fullName = fullName;
        user.password = ene_password;
        user.number = number;
        user.email = email;
        user.otp = { otpValue, otpExpiry };
        user.status = "Pending";
        await user.save();

        const mailSend = await sendEmail(sub, email, html);
        if (!mailSend) {
          return res.send({
            statusCode: 400,
            success: false,
            message: "OTP didn't send",
            result: {},
          });
        }

        return res.send({
          statusCode: 200,
          success: true,
          message: "User re-registered. OTP sent",
          result: { otpValue },
        });
      }
      // let message = "User already exists";
      // if (user.status === "Pending")
      //   message = "OTP already sent. Please verify.";
      // if (user.status === "Blocked")
      //   message = "Account blocked. Contact support.";

      return res.send({
        statuscode: 400,
        success: false,
        message:"user already exist",
        result: {},
      });
    }

    // ✅ New User – now generate OTP
    const { otpValue, otpExpiry } = generateOTP();
    const html = emailVerification(otpValue, fullName);
    const sub = "Sign Up Verification";

    const newUser = new User({
      email,
      fullName,
      password: ene_password,
      number,
      otp: { otpValue, otpExpiry },
      status: "Pending",
    });

    await newUser.save();

    const mailSend = await sendEmail(sub, email, html);
    if (!mailSend) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "OTP didn't send",
        result: {},
      });
    }

    return res.send({
      statuscode: 200,
      success: true,
      message: "User created and OTP sent successfully",
      result: { otpValue },
    });
  } catch (error) {
    return res.send({
      statuscode: 500,
      success: false,
      message: error.message + " Error in signup API",
      result: {},
    });
  }
};

exports.verifysignOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = email?.toLowerCase()?.trim();
    otp = otp?.trim();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "required email",
        result: {},
      });
    }
    if (!isValidEmail(email)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "please enter a valid email",
        result: {},
      });
    }

    if (!otp) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "required otp",
        result: {},
      });
    }

    if (otp.length !== 4) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "otp must be 4 digits",
        result: {},
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (otp !== user.otp.otpValue) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "invalid otp",
        result: {},
      });
    }
    if (Date.now() > user.otp.otpExpiry) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "otp has expired",
        result: {},
      });
    }
    user.status = "Active";
    user.otp = { otpValue: "", otpExpiry: "" };
    const saveUser = await user.save();
    if (saveUser) {
      return res.send({
        statuscode: 200,
        success: true,
        message: "otp verify successfully",
        result: {},
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in verify sign otp API",
    });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim()?.toLowerCase();
    password = password?.trim();

    if (!email) {
      return res.send({
        statusCode: 400,
        success: true,
        message: "email required",
        result: {},
      });
    }
    if (!isValidEmail(email)) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "please enter a valid email",
        result: {},
      });
    }

    if (!password) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "password required",
        result: {},
      });
    }
    if (!isStrongPassword(password)) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "please enter a strong password",
        result: {},
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: " user is deleted",
        result: {},
      });
    }
    if (user.status === "Pending") {
      return res.send({
        statuscode: 400,
        success: false,
        message: "Please verify OTP",
        result: {},
      });
    }

    const dec_password = await bcrypt.compare(password, user.password);

    if (!dec_password) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "password mismatch",
        result: {},
      });
    }

    const token = await generateJWT({
      _id: user._id,
      email: user.email,
    });

    user.token = token;

    await user.save();

    return res.send({
      statusCode: 200,
      success: true,
      message: "user login successfully",
      result: { token },
    });
  } catch (error) {
    return res.send({
      statuscode: 500,
      success: false,
      message: error.message + "Error in user login API",
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
        statuscode: 400,
        success: false,
        message: "Email required",
        result: {},
      });
    }
    if (!isValidEmail(email)) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "please enter a valid emaail",
        result: {},
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    const { otpValue, otpExpiry } = generateOTP();
    const name = user.fullName;
    const title = "Otp for forgotted password";
    const body = emailVerification(otpValue, name);

    user.otp = {
      otpValue: otpValue,
      otpExpiry: otpExpiry,
    };

    if (user && user.email) {
      await sendEmail(title, user.email, body);
    }

    await user.save();
    return res.send({
      statuscode: 200,
      success: true,
      message: "otp send successfully",
      result: { otpValue },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "Error in forget password api",
      result: {},
    });
  }
};
exports.verifyOTP = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = email?.toLowerCase()?.trim();
    otp = otp?.trim();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "required email",
        result: {},
      });
    }
    if (!isValidEmail(email)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "please enter a valid email",
        result: {},
      });
    }
    if (!otp) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "required otp",
        result: {},
      });
    }
    if (otp.length !== 4) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "otp must be 4 digits",
        result: {},
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (otp !== user.otp.otpValue) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "invalid otp",
        result: {},
      });
    }
    if (Date.now() > user.otp.otpExpiry) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "otp has expired",
        result: {},
      });
    }
    user.otp = { otpValue: "", otpExpiry: "" };

    const securityToken = CryptoJS.lib.WordArray.random(16).toString(
      CryptoJS.enc.Hex
    );
    // user.status = "Active"
    user.securityToken = securityToken;

    await user.save();
    return res.send({
      statuscode: 200,
      success: true,
      message: "otp verify successfully",
      result: { securityToken },
    });
  } catch (error) {
    return res.send({
      statuscode: 500,
      success: false,
      message: error.message + "internal server error",
      result: {},
    });
  }
};
exports.resendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.toLowerCase();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required email",
        result: {},
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    const currentTime = Date.now();
    if (
      user.otp.otpExpiry &&
      currentTime < user.otp.otpExpiry - 5 * 60 * 1000 + 30 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait! You can request OTP after 30 seconds",
        result: {},
      });
    }

    const { otpValue, otpExpiry } = generateOTP();
    // console.log("otp",otpExpiry)
    // if (user.otp.otpExpiry - Date.now() > 30 * 1000) {
    //   return res.send({
    //     success: false,
    //     statusCode: 400,
    //     message: "please wait!!, request after 30 sec",
    //     result:{}
    //   });
    // }
    const userName = user.fullName;
    const title = "Otp for forgotted password";
    const body = emailVerification(otpValue, userName);

    if (user && user.email) {
      await sendEmail(title, user.email, body);
    }

    // user.otp = { otpValue, otpExpiry };
    user.otp.otpValue = otpValue;
    user.otp.otpExpiry = otpExpiry;

    console.log("otp = " + user.otp);

    await user.save();
    return res.send({
      statuscode: 200,
      success: true,
      message: "otp Resend successfully",
      result: { otpValue },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in resent user otp api",
      result: {},
    });
  }
};

exports.updateForgotPassword = async (req, res) => {
  try {
    let { email, newPassword, confirmPassword, securityToken } = req.body;
    email = email?.toLowerCase()?.trim();
    newPassword = newPassword?.trim();
    confirmPassword = confirmPassword?.trim();
    if (!email) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "email required",
        result: {},
      });
    }
    if (!isValidEmail(email)) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "please enter a valid email",
        result: {},
      });
    }
    if (!newPassword) {
      return res.send({
        statuscode: 404,
        success: false,
        message: "please enter newPassword",
        result: {},
      });
    }
    if (!isStrongPassword(newPassword)) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "please enter a strong password",
        result: {},
      });
    }
    if (!confirmPassword) {
      return res.send({
        statuscode: 404,
        success: false,
        message: "required confirmPassword",
        result: {},
      });
    }
    if (!securityToken) {
      return res.send({
        statuscode: 404,
        success: false,
        message: "required security token",
        result: {},
      });
    }
    if (newPassword !== confirmPassword) {
      return res.send({
        statuscode: 404,
        success: false,
        message: "confirmPassword must be same as newPassword",
        result: {},
      });
    }

    const user = await User.findOne({
      email: email,
      securityToken: securityToken,
    });
    // console.log(user)
    if (!user) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    const isMatch = await bcrypt.compare(newPassword, user.password);

    if (isMatch) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "New password can not be same as old password",
        result: {},
      });
    }
    const ene_password = bcrypt.hashSync(newPassword, 10);

    user.password = ene_password;
    user.securityToken = "";

    await user.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Password reset successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message || "Error in update forgot password api",
      result: {},
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    let token = req.token;
    let { oldPassword, newPassword, confirmPassword } = req.body;
    oldPassword = oldPassword?.trim();
    newPassword = newPassword?.trim();
    confirmPassword = confirmPassword?.trim();
    if (!oldPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "OldPassword required",
        result: {},
      });
    }
    if (!newPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "required newpassword",
        result: {},
      });
    }
    if (!confirmPassword) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "required confirmPassword",
        result: {},
      });
    }
    if (!isStrongPassword(newPassword)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "must be strong",
        result: {},
      });
    }

    if (newPassword !== confirmPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "newpassword and confirm password must be same",
        result: {},
      });
    }

    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }

    const oldMatch = await bcrypt.compare(oldPassword, user.password);
    if (!oldMatch) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "Invalid old password",
        result: {},
      });
    }
    const issame = await bcrypt.compare(newPassword, user.password);
    if (issame) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "new password can not be same as old password",
        result: {},
      });
    }
    const ene_password = bcrypt.hashSync(newPassword, 10);

    user.password = ene_password;

    const saveUser = await user.save();
    if (saveUser) {
      return res.send({
        statuscode: 200,
        success: true,
        message: "password change successfully",
        result: {},
      });
    }
  } catch (error) {
    return res.send({
      statuscode: 500,
      success: false,
      message: error.message + "Error in change password api",
      result: {},
    });
  }
};

exports.logout = async (req, res) => {
  try {
    let token = req.token;
    let _id = token._id;
    console.log("id", _id);

    if (!_id) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "required id",
        result: {},
      });
    }

    const user = await User.findByIdAndUpdate(
      token._id,

      { $set: { logOut: Date.now() } },
      { new: true }
    );
    if (
      user.status === "Delete" ||
      user.status === "Block" ||
      user.status === "Pending"
    ) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive user",
        result: {},
      });
    }
    if (user) {
      user.token = " ";
      user.save();
      return res.send({
        statusCode: 200,
        success: true,
        message: "user logout successfully",
        result: {},
      });
    }
  } catch (error) {
    return res.send({
      statuscode: 500,
      success: false,
      message: error.message + "Error in user logout API",
      result: {},
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    let skip = (page - 1) * limit;

    const admin = await Admin.findOne({ _id: token._id });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized admin",
        result: {},
      });
    }

    if (admin.status === "Delete") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been deleted",
        result: {},
      });
    }
    if (admin.status === "Blocked") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been blocked",
        result: {},
      });
    }

    const allUser = await User.find({})
      .skip(skip)
      .limit(limit)
      .select("-token -password -otp");
    const totalUser = await User.countDocuments({});
    return res.send({
      statusCode: 200,
      success: true,
      message: "All user fetched successfully",
      result: {
        user: allUser,
        currentPage: page,
        totalPages: Math.ceil(totalUser / limit),
        totalRecords: totalUser,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statuscode: 500,
      succes: false,
      message: error.message + " ERROR in get all user api",
      return: { error },
    });
  }
};
exports.getAllActiveUser = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    let skip = (page - 1) * limit;

    const admin = await Admin.findOne({ _id: token._id });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized admin",
        result: {},
      });
    }

    if (admin.status === "Delete") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been deleted",
        result: {},
      });
    }
    if (admin.status === "Blocked") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been blocked",
        result: {},
      });
    }

    const allUser = await User.find({ status: "Active" })
      .skip(skip)
      .limit(limit)
      .select("-token -password -otp");
    const totalUser = await User.countDocuments({ status: "Active" });
    return res.send({
      statusCode: 200,
      success: true,
      message: "All user fetched successfully",
      result: {
        user: allUser,
        currentPage: page,
        totalPages: Math.ceil(totalUser / limit),
        totalRecords: totalUser,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statuscode: 500,
      succes: false,
      message: error.message + " ERROR in get all active user api",
      return: error,
    });
  }
};
exports.getAllRecentUser = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    let skip = (page - 1) * limit;

    const admin = await Admin.findOne({ _id: token._id });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized admin",
        result: {},
      });
    }

    if (admin.status === "Delete") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been deleted",
        result: {},
      });
    }
    if (admin.status === "Blocked") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been blocked",
        result: {},
      });
    }

    const allUser = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-token -password -otp");
    const totalUser = await User.countDocuments({});
    return res.send({
      statusCode: 200,
      success: true,
      message: "All recent user fetched successfully",
      result: {
        user: allUser,
        currentPage: page,
        totalPages: Math.ceil(totalUser / limit),
        totalRecords: totalUser,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statuscode: 500,
      succes: false,
      message: error.message + " ERROR in get all active user api",
      return: error,
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    let token = req.token;
    let { fullName, number } = req.body;
    let profilePhoto = req.file ? req.file.path : null;
    fullName = fullName = fullName?.trim();
    // email = email?.toLowerCase()?.trim();
    if (!fullName) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required fullName",
        result: {},
      });
    }
    // if (!email) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "Required email",
    //     result: {},
    //   });
    // }
    // if (!isValidEmail(email)) {
    //   return res.send({
    //     statusCode: 401,
    //     success: false,
    //     message: "Please enter a valid email ",
    //     result: {},
    //   });
    // }
    // if (!number) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "Required number",
    //     result: {},
    //   });
    // }
    const user = await User.findOne({ _id: token._id, status: "Active" });

    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "User not found",
        result: {},
      });
    }

    user.fullName = fullName;

    // user.number = number;
    if (profilePhoto) {
      user.profilePhoto = profilePhoto;
    }
    await user.save();
    return res.send({
      statusCode: 202,
      success: true,
      message: "User updated successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in update user profile",
      result: {},
    });
  }
};
exports.getprofile = async (req, res) => {
  try {
    let token = req.token;
    let { userId } = req.params;
    const admin = await Admin.findOne({ _id: token._id });

    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized admin",
        result: {},
      });
    }

    if (admin.status === "Delete") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been deleted",
        result: {},
      });
    }
    if (admin.status === "Blocked") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been blocked",
        result: {},
      });
    }

    const user = await User.findById(userId);
    // console.log("sdfniu",user)
    // .select(
    //   "-otp -accessToken -resendOtpDetails -securityPinTryCount -securityPin -securityToken -discountCode -fcmToken -photo -referralCode -notificationTune"
    // );
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized user",
        result: {},
      });
    }

    if (user.status === "Delete") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "User has been deleted",
        result: {},
      });
    }
    if (user.status === "Blocked") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "User has been blocked",
        result: {},
      });
    }
    if (user.status === "Pending") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Unauthorise access",
        result: {},
      });
    }
    return res.send({
      statusCode: 200,
      succes: true,
      message: "User fetched successfully",
      result: {
        user: {
          _id: user._id,
          fullName: user.fullName || "N/A",
          email: user.email || "N/A",
          status: user.status || "N/A",
          profilePhoto: user.profilePhoto || "N/A",
          lastActive: user.lastActive || "N/A",
        },
      },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get profile api",
      result: {},
    });
  }
};

exports.userStatus = async (req, res) => {
  // const express = require("express");
  // const http = require("http");
  const socketIo = require("socket.io");
  // const mongoose = require("mongoose");
  const cors = require("cors");
  // const User = require("./models/userModel");

  const app = express();
  // const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: "*",
    },
  });

  // mongoose.connect("mongodb://localhost:27017/restaurantApp", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });

  app.use(cors());
  app.use(express.json());

  // ✅ Socket.io: Handle Online & Offline Status
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // 🟢 Jab user app open kare to "Online" ho jaye
    socket.on("userOnline", async (userId) => {
      await User.findByIdAndUpdate(userId, {
        userStatus: "Online",
        lastActive: Date.now(),
      });
      io.emit("statusUpdated", { userId, status: "Online" });
      console.log(`User ${userId} is Online`);
    });

    // 🔴 Jab user app band kare to "Offline" ho jaye
    socket.on("userOffline", async (userId) => {
      await User.findByIdAndUpdate(userId, {
        userStatus: "Offline",
        lastActive: Date.now(),
      });
      io.emit("statusUpdated", { userId, status: "Offline" });
      console.log(`User ${userId} is Offline`);
    });

    // 🔴 Jab user app band kare ya net chala jaye to bhi offline ho
    socket.on("disconnect", async () => {
      console.log("User Disconnected:", socket.id);
      await User.findOneAndUpdate(
        { userStatus: "Online" },
        { userStatus: "Offline", lastActive: Date.now() }
      );
      io.emit("statusUpdated", { status: "Offline" });
    });
  });
};

exports.deleteUser = async (req, res) => {
  try {
    let token = req.token;
    let { userId } = req.params;
    if(!userId){
      return res.send({
        statusCode:400,
        success:false,
        message:"required user id",
        result:{}
      })
    }
    let admin = await Admin.findById({ _id: token._id, status: "Active" });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }
    let user = await User.findOne({ _id: userId });
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user && user.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has already deleted",
        result: {},
      });
    }
    user.status = "Delete";
    user.accessToken = "";
    await user.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "user deleted successfully",
      result: {
        name: user.fullName,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode: 500,
      success: false,
      message: "Error in deleting  user API " + error.message,
      result: {},
    });
  }
};
exports.handleStatus = async (req, res) => {
  try {
    let token = req.token;
    let { userId } = req.params;
    let { status } = req.body;

    if (!status) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Status required",
        result: {},
      });
    }

    const admin = await Admin.findOne({ _id: token._id });

    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized admin",
        result: {},
      });
    }

    if (admin.status === "Delete") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been deleted",
        result: {},
      });
    }
    if (admin.status === "Blocked") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been blocked",
        result: {},
      });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized user",
        result: {},
      });
    }
    user.status = status;

    await user.save();

    return res.send({
      statusCode: 200,
      succes: true,
      message: "User Status Update successfully",
      result: {},
    });
  } catch (error) {}
};
exports.saveLocation =async(req, res) => {
  const {userId} = req.params;
  const token = req.token
    const { latitude, longitude } = req.body;
  
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }
  console.log("cordinates", latitude,longitude)
    try {
      const user = await User.findOne({_id:userId}) 
      if(!user){
        return res.send({
          statusCode:404,
          success:false,
          message:"user not found",
          result:{}
        })
      }
      if(user.status === "Delete"){
        return res.send({
          statusCode:400,
          success:false,
          message:"user has been deleted",
          result:{}
        })
      }
      if(user.status === "Pending"){
        return res.send({
          statusCode:400,
          success:false,
          message:"unauthorise access",
          result:{}
        })
      }
      if(user.status === "Block"){
        return res.send({
          statusCode:400,
          success:false,
          message:"user has been blocked",
          result:{}
        })
      }
      user.userlocation.coordinates = [latitude,longitude]
      await user.save()
      return res.send({ 
        statusCode:200,
        success:true,
        message: 'Location saved successfully',
      result:{}
     });
    } catch (err) {
      console.error(err);
      return res.send({ 
        statusCode:500,
        message: 'Server error',
       success:false,
      result:{}});
    }

}