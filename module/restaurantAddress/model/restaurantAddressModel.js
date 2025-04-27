const mongoose = require("mongoose");

const restaurantAddressSchema = new mongoose.Schema({
    restaurantId:{
           type: mongoose.Schema.Types.ObjectId,
                ref: "Restaurant",
       },
       type:{
        type:String,
       enum:["Home","Office","Work","Other"],
       default:"Home",
    },
    completeAddress:{
        type:String,
        default:""
    },
    status:{
        type:String,
        enum:["Active","Delete"],
        default:"Active"
    },
},{timestamps:true})

const restaurantAddress = mongoose.model("restaurantAddress",restaurantAddressSchema)

module.exports = restaurantAddress;