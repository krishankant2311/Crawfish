// const mongoose = require('mongoose')

// const privacyPolicySchema = mongoose.Schema({
//     adminId :{ 
//        type: mongoose.Schema.Types.ObjectId,
//              ref: "Admin",
//     },

//     titile:{
//         type:String,
//         default:""
//     },
//     content:{
//         type:String,
//         default:""
//     },
// },
// { timestamps: true })

// const PrivacyPolicy = mongoose.model("PrivacyPolicy",privacyPolicySchema)

// module.exports = PrivacyPolicy
const {mongoose} = require('mongoose');
const privacypolicySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
},{timestamps:true})
const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacypolicySchema);
// Export the model so it can be used in other files.
module.exports = PrivacyPolicy;