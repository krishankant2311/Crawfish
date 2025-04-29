const mongoose = require("mongoose")
const User = require("../../user/model/userModel")
const Restaurant = require("../../restaurants/model/restaurantModel")

const favouriteSchema  = new mongoose.Schema({
       userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        restaurantId: {
            type:  mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
          },
          status:{
            type:String,
            enum:["Active","Inactive"],
            default:"Active"
          },
          isFavourite:{
            type:Boolean,
            default:false
          },
},
{timestamps: true})

const Favourite = mongoose.model("favourite",favouriteSchema)

module.exports = Favourite;