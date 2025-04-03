const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const validator = require("validator");
const Admin = require("../model/adminModel");
const { generateJWT } = require("../../../middlewares/jwt");
const { default: isEmail } = require("validator/lib/isEmail");
const genrateOTP = require("../../../helpers/genrateOTP");
const sendEmail = require("../../../mail/mailSender");
const emailVerification = require("../../../templates/emailVerification");
const forgototpTemplate = require("../../../templates/forgotpasswordmail")

const isEmailvalid = (email) => {
  return validator.isEmail(email);
};
const isPasswordValid = (password, newPassword) => {
  const options = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  };
  return validator.isStrongPassword(password, newPassword, options);
};

exports.loginAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.toLowerCase()?.trim();
    password = password?.trim();

    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email is required",
      });
    }
    if (!password) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Password is required",
      });
    }
    if (!isEmailvalid(email)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Invalid email",
      });
    }
    if (!isPasswordValid(password)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Password should be strong",
      });
    }

    let admin = await Admin.findOne({
      email,
    });
    if (!admin) {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Invalid email or password",
      });
    }
    let isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Invalid  password",
      });
    }
    let token = await generateJWT({
      _id: admin._id,
      email: admin.email,
    });
    admin.token = token;

    await admin.save();

    return res.send({
      statusCode: 200,
      success: true,
      message: "Logged in successfully",
      result: {
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: error.message + " Error in Login admin API",
      statusCode: 400,
    });
  }
};
exports.adminForgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.toLowerCase()?.trim();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email is required",
        result: {},
      });
    }
    if (!isEmailvalid(email)) {
      return res.send({
        statusCode: 400,
        succes: false,
        message: "Email is not valid",
        result: {},
      });
    }
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }
    if (admin.status === "Delete" || admin.status === "Block") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Admin account has been delete and Block",
        result: {},
      });
    }
    let { otpValue, otpExpiry } = genrateOTP();
    const name = admin.adminName;
    const title = "Otp for Forgotted Password";
    const body = forgototpTemplate(otpValue, name);
    admin.otp = {
      otpValue: otpValue,
      otpExpiry: otpExpiry,
    };
    if (admin && admin.email) {
      await sendEmail(title, admin.email, body);
    }
    await admin.save();
    return res.send({
      statuscode: 200,
      success: true,
      message: "otp send successfully",
      result: { otpValue },
    });
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode: 400,
      success: false,
      message: "Error in forgetting password API" + error.message,
      result: {},
    });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    email = email?.toLowerCase()?.trim();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email is required",
      });
    }
    if (!otp) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "OTP is required",
      });
    }
    if (otp.length === 5) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "OTP should be 5 digits",
      });
    }

    let admin = await Admin.findOne({ email, status: "Active" });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
      });
    }
    if (admin === "Delete") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Admin account has been delete",
      });
    }
    if (admin === "Blocked") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Admin account has been Block",
      });
    }
    if (admin.otp.otpValue !== otp && admin.otp.otpExpiry < Date.now()) {
      return res.send({
        statusCode: 401,
        success: false,
        message: "OTP expired",
      });
    }
    admin.otp.otpValue = null;
    admin.otp.otpExpiry = null;

    const securityToken = CryptoJS.lib.WordArray.random(16).toString(
      CryptoJS.enc.Hex
    );
    admin.securityToken = securityToken;
    await admin.save();

    return res.send({
      statusCode: 200,
      success: true,
      message: "OTP verified successfully",
      result:{securityToken}
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: error.message + " Error in verify OTP API",
      statusCode: 400,
    });
  }
};
exports.changeForgotPassword = async (req, res) => {
  try {
    let { email, password, confirmPassword, securityToken } = req.body;
    email = email?.toLowerCase()?.trim();
    password = password?.trim();
    confirmPassword = confirmPassword?.trim();
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email is required",
      });
    }
    if (!password) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Password is required",
      });
    }
    if (!confirmPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Confirm Password is required",
      });
    }
    if (!securityToken) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Security Token is required",
      });
    }
    let admin = await Admin.findOne({ email, securityToken });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found or security token not found",
      });
    }
    if (admin.status === "Delete" || admin.status === "Blocked") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Admin account has been delete and Block",
      });
    }
    if (!isPasswordValid(password)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Password should be strong",
      });
    }
    if (password !== confirmPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }
    admin.password = await bcrypt.hash(password, 10);
    admin.securityToken = null;
    await admin.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: error.message + " Error in change forgot password API",
      statusCode: 400,
    });
  }
};
exports.changepassword = async (req, res) => {
  try {
    let { _id } = req.token;
    let { oldPassword, newPassword, confirmPassword } = req.body;

    oldPassword = oldPassword?.trim();
    newPassword = newPassword?.trim();
    confirmPassword = confirmPassword?.trim();
    if (!_id) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Id required",
        result: {},
      });
    }

    const admin = await Admin.findOne({ _id: _id });
    if (!admin) {
      return res.send({
        statuscode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }
    if (admin.status === "Delete") {
      return res.send({
        statuscode: 401,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    if (!oldPassword) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "Required old password",
        result: {},
      });
    }
    if (!newPassword) {
      return res.send({
        statuscode: 400,
        success: false,
        message: "Required new password",
        result: {},
      });
    }
    if (!isPasswordValid(newPassword)) {
      return res.send({
        statusCode: 400,
        success: false,
        message:
          "Password must have at least one uppercase one lowercase one one number and one symbol",
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
    if (newPassword != confirmPassword) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "confirm password must be same as new password",
        result: {},
      });
    }
    let isOldMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isOldMatch) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Old Password is incorrect",
        result: {},
      });
    }
    let isMatch = await bcrypt.compare(newPassword, admin.password);

    if (isMatch) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "New password can not be same as old password",
        result: {},
      });
    }
    const ene_password = await bcrypt.hashSync(newPassword, 10);
    if (ene_password) {
      admin.password = ene_password;
      await admin.save();
      return res.send({
        statusCode: 200,
        success: true,
        message: "Password change successfully",
        result: {},
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: error.message + " Error in change password API",
      statusCode: 400,
    });
  }
};

exports.adminLogout = async (req, res) => {
  try {
    let { _id } = req.token;
    let admin = await Admin.findByIdAndUpdate(
      { _id },
      { $set: { logOut: Date.now(), accessToken: "" } },
      { new: true }
    );
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }
    if (admin.status === "Delete" || admin.status === "Block") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Admin account has been delete and Block",
        result: {},
      });
    }
    if (admin) {
      return res.send({
        statusCode: 200,
        success: true,
        message: "Admin logged out successfully",
        result: {},
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode: 400,
      success: false,
      message: "error in admin logout API" + error.message,
      result: {},
    });
  }
};
exports.editAdminProfile = async (req, res) => {
  try {
    let token = req.token;
    let { adminName, mobileNumber } = req.body;
    adminName = adminName?.toLowerCase()?.trim();
    mobileNumber = mobileNumber?.trim();
    let  admin = await Admin.findOne({_id: token._id});
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      })
    }
    if (admin.status === "Delete" || admin.status === "Blocked") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Admin account has been delete and Block",
        result: {},
      });
    }
    if (adminName) admin.adminName = adminName;
    if (mobileNumber) admin.mobileNumber = mobileNumber;
    await admin.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Admin profile updated successfully",
      result: {
        adminId: admin._id,
        adminEmail: admin.adminEmail,
        adminName: admin.adminName,
        mobileNumber: admin.mobileNumber,
        status: admin.status,
      },
    })
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode: 400,
      success: false,
      message: "Error in edit admin API",
      result: {},
    });
  }
}
exports.addSubAdmin = async (req, res) => {
  try {
    let { adminName, email, password,mobileNumber } = req.body;
    let { _id } = req.token;
    adminName = adminName?.toLowerCase()?.trim();
    email = email?.toLowerCase()?.trim();
    password = password?.trim();
    mobileNumber = mobileNumber?.trim();

    let admin = await Admin.findById({ _id: _id, status: "Active" });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }
    if (!adminName) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Admin name is required",
        result: {},
      });
    }
    if (!email) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Email is required",
        result: {},
      });
    }
    if (!password) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Password is required",
        result: {},
      });
    }
    if (!isEmailvalid(email)) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Invalid email format",
        result: {},
      });
    }
    if (!isPasswordValid(password)) {
      return res.send({
        statusCode: 400,
        success: false,
        message:
          "Password must have at least one uppercase one lowercase one one number and one symbol",
        result: {},
      });
    }
    if (!mobileNumber) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Mobile number is required ",
        result: {},
      });
    }
    if (mobileNumber.length !== 10) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Mobile number must be 10 digits.",
        result: {},
      });
    }
    let addSubAdmin = await Admin.findOne({ email });
    if (addSubAdmin) {
      if (addSubAdmin.status === "Delete") {
        addSubAdmin.email = email;
        addSubAdmin.password = bcrypt.hashSync(password, 10);
        addSubAdmin.mobileNumber = mobileNumber;
        addSubAdmin.status = "Active";
        await addSubAdmin.save();
        return res.send({
          statusCode: 200,
          success: true,
          message: "Sub admin added successfully",
          result: {
            addSubAdmin,
          },
        });
      }
      
  
      return res.send({
        statusCode: 409,
        success: false,
        message: "Sub admin already exists with this email",
        result: {},
      });
    }

    let enc_password = bcrypt.hashSync(password, 10);
    let addNewSubAdmin = new Admin({
      adminName,
      email,
      password: enc_password,
      mobileNumber,
      isSuperAdmin: false,
      status: "Active",
    });
    
    
    let token = await generateJWT({
      _id: addNewSubAdmin._id,
      email: addNewSubAdmin.email,
    });
    addNewSubAdmin.token = token;
    await addNewSubAdmin.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Sub admin added successfully",
      result: {
        addNewSubAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode: 400,
      success: false,
      message: "Error in adding sub admin API " + error.message,
      result: {},
    });
  }
};

exports.getSubAdmin = async (req, res) => {
  try {
    let token = req.token;
    let { _id } = req.params;
    let admin = await Admin.findById({ _id: token._id, status: "Active" });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }
    let subadmin = await Admin.findOne({ _id: _id});
    if (!subadmin) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Sub admin  not found ",
        result: {}
      });
    }
    if (admin.status === "Delete") {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin has been deleted",
        result: {},
      });
    }
    return res.send({
      statusCode:200,
      success:true,
      message:"subadmin found successfully",
      result:{subadmin}
    })
   
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode: 400,
      success: false,
      message: "Error in get sub admin API " + error.message,
      result: {},
    });
  }
};

exports.getAllSubAdmin = async (req, res) => {
  try {
    let { _id } = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page, 10);
    limit = Number.parseInt(limit, 10);
    const skip = (page - 1) * limit;

    const superAdmin = await Admin.findOne({
      _id: _id,
      status: "Active",
      isSuperAdmin: true,
    });
    if (!superAdmin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Super admin not found",
        result: {},
      });
    }
    let subadmins = await Admin.find({
      isSuperAdmin: false,
    })
     
    .skip(skip)
    .limit(limit)
    .select("_id adminName email isSuperAdmin status ");
    const totalSubAdmin = await Admin.countDocuments();
    return res.send({
      statusCode: 200,
      success: true,
      message: "All admin fetched successfully",
      result: {
        subAdmins: subadmins,
        currentPage: page,
        totalPages: Math.ceil(totalSubAdmin / limit),
        totalRecords: totalSubAdmin,
      },
    });

  } catch (error) {
    console.log(error);
    return res.send({
      statusCode: 400,
      success: false,
      message: "Error in getting all sub admin API " + error.message,
      result: {},
    });
  }
};

exports.deleteSubAdmin = async (req, res) => {
  try {
    let { _id } = req.token;
    let { adminId } = req.params;
    let admin = await Admin.findById({ _id: _id, status: "Active", isSuperAdmin: true });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }
   
let subAdmin = await Admin.findOne({_id: adminId})
    
    if (!subAdmin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Sub admin not found",
        result: {},
      });
    }
    if (subAdmin && subAdmin.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Sub admin is already deleted",
        result: {},
      });
    }
    subAdmin.status = "Delete";
    subAdmin.accessToken = "";
    await subAdmin.save();

    
    return res.send ({
        statusCode: 200,
        success: true,
        message: "Sub admin deleted successfully",
        result: {
          name:subAdmin.adminName,
          email:subAdmin.email,
          status: subAdmin.status,
        },
      })
    
   
    
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode: 500,
      success: false,
      message: "Error in deleting sub admin API " + error.message,
      result: {},
    });
    
  }
}

exports.editSubAdmin = async (req, res) => {
  try {
    let { _id } = req.token;
    let { adminId } = req.params;
    let { adminName, password , status }= req.body;
    adminName = adminName?.trim();
    password = password?.trim();

    let admin = await Admin.findById({ _id: _id, status: "Active", isSuperAdmin: true });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }
    let subAdmin = await Admin.findOne({ _id: adminId });
    if (!subAdmin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Sub admin not found",
        result: {},
      });
    }
    if (subAdmin.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Sub admin is already deleted",
        result: {},
      });
    }
   
   // Update only if values are provided
   if (adminName) subAdmin.adminName = adminName;
   if (status) subAdmin.status = status;

   // Only hash and update password if it's provided
   if (password) {
     subAdmin.password = bcrypt.hashSync(password, 10);
   }
    await subAdmin.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Sub admin edited successfully",
      result: {
        name: subAdmin.adminName,
        email: subAdmin.email,
        status: subAdmin.status,
      },
    } );
   
    
  } catch (error) {
    console.log(error);
    return res.send({
      statusCode: 500,
      success: false,
      message: "Error in editing sub admin API " + error.message,
      result: {},
    });
    
  }
}














