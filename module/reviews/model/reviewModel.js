const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    
    userName: {
      type: String,
      default: "",
    },
    userEmail: {
      type: String,
      default: "",
    // },
    // userprofilePhoto:{
    //   type:String,
    //   default:""
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    content: {
      type: String,
      default: "",
    },
    photos: [
      {
        type: String,
        default: "",
      },
    ],

    userprofilePhoto: {
      type: String,
      default: "",
    },
    status: {
        type: String,
        enum: ["Active", "Delete"],
        default: "Active",
      },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
