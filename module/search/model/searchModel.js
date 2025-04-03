const mongoose = require("mongoose")

const searchSchema =new mongoose.Schema({
     userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            query:{
                type:String,
                default:""
            },
            status:{
              type:String,
              enum:["Delete","Active"],
              default:"Active"
            }
          
},{timestamps:true})

const Search = mongoose.model("Search",searchSchema);
module.exports = Search