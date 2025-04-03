const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Delete", "Block"],
      default: "Active",
    },
    securityToken: {
      type: String,
      default: "",
    },
    otp: {
      otpValue: {
        type: String,
        default: "",
      },
      otpExpiry: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

const getAdmin = async () => {
  try {
    const admin = await Admin.findOne({
      email: "abhinandan@jewarinternational.com",
    });
    if (admin) {
      console.log("Admin already exist");
    } else {
      let createAdmin = {
        email: "abhinandan@jewarinternational.com",
        password: await bcrypt.hashSync("Admin@123", 10),
        adminName: "Abhinandan",
        isSuperAdmin: true,
      };
      let newAdmin = new Admin(createAdmin);
      await newAdmin.save();
      console.log("Admin create successfully");
    }
  } catch (error) {
    console.log("Error!!", error);
  }
};
getAdmin();
