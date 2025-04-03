const PrivacyPolicy = require('../../privacyPolicy/model/privacyPolicyModel')
const Admin = require('../../admin/model/adminModel')
const User = require('../../user/model/userModel')


exports.createPrivacyPolicy = async (req, res) => {
    try{
        let token = req. token;
        let {content} = req.body;
        if(!content) {
            return res.send({
                statusCode: 400,
                success: false,
                message: 'Content is required',
                result: {},
            })
        }
        let admin = await Admin.findOne({_id: token._id});
        if(!admin) {
            return res.send({
                statusCode: 400,
                success: false,
                message: 'Admin not found',
                result: {},
            })
        }
        if(admin.status === 'Delete'){
            return res.send({
                statusCode: 400,
                success: false,
                message: 'Admin is deleted',
                result: {},
            })
        }
        const policy = await PrivacyPolicy.findOne({});
        if(policy){
            policy.content = content;
            await policy.save();
            return res.send({
                statusCode: 200,
                success: true,
                message: 'Privacy policy updated successfully',
                result: {policy},
            })
        }
        const createPrivacyPolicy = new PrivacyPolicy({
            content
        });
        await createPrivacyPolicy.save();
        return res.send({
            statusCode: 200,
            success: true,
            message: 'Privacy policy created successfully',
            result: {policy: createPrivacyPolicy},
        })
    }
    catch(error){
        console.log(error)
        return res.send({
            statusCode: 400,
            success: false,
            message: 'Error in creating privacy policy' + error.message,
            result: {},
        })
    }
}
exports.getPrivacyPolicy = async (req, res) => {
    try {
        let token = req.token;
        let admin = await  Admin.findOne({_id: token._id});
        let user = await User.findOne({_id: token._id});
        if (!admin &&!user) {
            return res.send({
                statusCode: 404,
                success: false,
                message: "Unauthorized acess",
                result: {},
            })
        }
        let policy = await PrivacyPolicy.findOne({});
        if (!policy) {
            return res.send({
                statusCode: 404,
                success: false,
                message: "Privacy policy not found",
                result: {},
            })
        }
        return res.send({
            statusCode: 200,
            success: true,
            message: "Privacy policy fetched successfully",
            result: {
                _id:policy._id,
                content:policy.content,
                status:policy.status,
            },
        })
    } catch (error) {
        console.log(error);
        return res.send({
            statusCode: 500,
            success: false,
            message: "Error in getting privacy policy API" + error.message,
            result: {},
        })
    }
}