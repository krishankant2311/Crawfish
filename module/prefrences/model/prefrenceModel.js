const mongoose = require("mongoose");

const prefrenceSchema = mongoose.Schema({
   adminId:{
       type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
   },
  image: {
    type: String,
    default: "",
    required:true,
  },
  name: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },

  status:{
   type:String,
   enum:["Active","Delete"],
   default:"Active"
  },
}, {timestamps:true});

const Prefrence = mongoose.model("Prefrence", prefrenceSchema);
module.exports = Prefrence;
