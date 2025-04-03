const mongoose=require('mongoose');
require("dotenv").config();


exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log('Connected to MongoDB');
    }).catch(()=>{
        console.error('Failed to connect to MongoDB');
    })

}
