const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
      default: "",
    },

    otp: {
      otpValue: {
        type: String,
        // required: true,
        default: "",
      },
      otpExpiry: {
        type: String,
        default: "",
      },
    },
    securityToken: {
      type: String,
      default: "",
    },
    userStatus: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },

    status: {
      type: String,
      enum: ["Active", "Delete", "Block", "Pending"],
      default: "Pending",
    },
    language: {
      type: String,
      enum: ["Hindi", "English"],
      default: "English",
    },
    AppMode: {
      type: String,
      enum: ["Dark", "Light"],
      default: "Light",
    },
    token: {
      type: String,
      default: "",
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    fcmToken: {
      type: String,
      default: "",
    },
    // preferences: {
    //   sendTargetNotification: {
    //     type: Boolean,
    //     default: true,
    //   },
    //   specialOffers: {
    //     type: Boolean,
    //     default: true,
    //   },
    //   systemChanges: {
    //     type: Boolean,
    //     default: false,
    //   },
    // },

    logOut: {
      type: Date,
      default: "",
    },
    profilePhoto: {
      type: String,
      // required: true,
      default: "",
    },
    userlocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        deafult: [0, 0],
        // required: true,
      },
    },
  },
  { timestamps: true }
);
userSchema.index({ "currentLocation.coordinates": "2dsphere" });
const User = mongoose.model("user", userSchema);

module.exports = User;
