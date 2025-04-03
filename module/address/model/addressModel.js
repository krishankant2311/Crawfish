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
        floorNumber :{
            type:String,
            require:true,
            default:""
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
