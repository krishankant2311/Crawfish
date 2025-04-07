// const express = require("express");
const mongoose = require("mongoose");
// const { restaurantProfile } = require("../controller/restaurantController");

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: true,
    // trim: true,
  },
  description: {
    type: String,
    // required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  fullAddress: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  businessHour: {
    type: String,
    default: "",
  },
  // restaurantProfile:{
  //   type:String,
  //   default:""
  // },
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
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Delete", "Block", "Pending"],
    default: "Pending",
  },
  token: {
    type: String,
    default: "",
  },
  restaurantLogo: {
    type: String,
    default: "",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0], 
    }
  },
  menu: {
    type: String,
    // required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  website: {
    type: String,
    // trim: true,
  },

  securityToken: {
    type: String,
    default: "",
  },
  timingHours: [
    {
      dayOfWeek: {
        type: String,
        enum: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        // required: true,
      },
      openTime: {
        type: String,
        // required: true,
        default: "",
      },
      closeTime: {
        type: String,
        // required: true,
        default: "",
      },
    },
  ],
  tags: [
    {
      type: String,
      // required: true,
    },
  ],
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
restaurantSchema.index({ location: "2dsphere" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
