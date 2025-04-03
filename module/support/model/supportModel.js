const mongoose = require("mongoose")

const supportSchema =new mongoose.Schema({

    title:{
        type:String,
        default:""
    },
    Description:{
        type:String,
        default:""
    },
    status:{
        type:String,
        enum:["Solved","pending"],
        default:"Pending"
    },
})

const Support = mongoose.model("Support",supportSchema)

module.exports = Support;