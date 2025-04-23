const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        completeAddress : {
            type : String,
            require:true,
            default:""
        },
        type: {
            type: String,
            enum: ["Home", "Work","Office","Other"],
            default: "Home",
          },
        // howToReach : {
        //     type:String,
        //     default:""
        // },
        status:{
            type:String,
            enum: ["Active","Delete"],
            default:"Active"
        }, 
        currentLocation: {
            type: { type: String },
            // default: '',
            coordinates: { type: [Number] },
          },
},
{timestamps:true});

addressSchema.index({ "currentLocation.coordinates": "2dsphere" });

const Address = mongoose.model("address",addressSchema)

module.exports = Address;
