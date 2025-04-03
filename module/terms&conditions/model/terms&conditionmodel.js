const mongoose = require ('mongoose')
const terms_conditionSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            default:"",
        },

        content:{
            type:String,
            default:""
        }

},{timestamps:true})

const TermsCondition = mongoose.model("termsCondition",terms_conditionSchema)

module.exports = TermsCondition;