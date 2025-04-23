const mongoose = require("mongoose")

const supportSchema =new mongoose.Schema({

    userId : { 
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    restaurantId: {
        type :mongoose.Schema.Types.ObjectId,
        ref:"Restaurant"
    },
    title:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
    },
    status:{
        type:String,
        enum:["Solved","Pending"],
        default:"Pending"
    },
})

const Support = mongoose.model("Support",supportSchema)

module.exports = Support;