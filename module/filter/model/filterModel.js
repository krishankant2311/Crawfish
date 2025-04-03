const mongoose = require('mongoose')

const filterSchema = new mongoose.Schema({
    distance:{
        type:Number,
        min:0,
        default:10,
    },
    verified:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        default:5
    }
})
const Filter = mongoose.model("Filter",filterSchema);
module.exports = Filter