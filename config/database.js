const mongoose=require('mongoose');
require("dotenv").config();


exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{autoIndex: true}).then(()=>{
        console.log('Connected to MongoDB');
    }).catch(()=>{
        console.error('Failed to connect to MongoDB');
    })

}
