const support = require("../model/supportModel")
const user = require("../../user/model/userModel")

const admin = require("../../admin/model/adminModel")

exports.createsupport = async(req,res) => {
    try {
        let token = req.token
        let{title,description,status} = req.body;
        title = title?.trim()
        if(!title){
            return res.send({
                statusCode:400,
                success:false,
                message:"Required title",
                result:{}
            })
        }
        if(!description){
            return res.send({
                statusCode:400,
                success:false,
                message:"Required description",
                result:{}
            })
        }
    
    } catch (error) {
        
    }
}