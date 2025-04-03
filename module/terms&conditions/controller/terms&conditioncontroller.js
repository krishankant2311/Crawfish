const TermsCondition = require("../../terms&conditions/model/terms&conditionmodel");
const Admin = require("../../admin/model/adminModel");
const User = require("../../user/model/userModel");

exports.createTermsAndCondition = async (req, res) => {
  try {
    let token = req.token;
    let { title, content } = req.body;
    if (!title) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required title ",
        result: {},
      });
    }
    if (!content) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required content",
        result: {},
      });
    }

    const admin = await Admin.findOne({ _id: token._id });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "admin not found",
        result: {},
      });
    }
    if (admin.status === "Delete") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Your account has been deleted",
        result: {},
      });
    }
    if (admin.status === "Block") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Admin has blocked",
        result: {},
      });
    }
    if (admin.status === "Pending") {
      return res.send({
        statuscode: 401,
        success: false,
        message: "Inactive admin",
        result: {},
      });
    }
    const termscondition = await TermsCondition.findOne({  });
    if (termscondition) {
        termscondition.title = title;
        termscondition.content = content;
        await termscondition.save();
      return res.send({
        statusCode: 200,
        success: true,
        message: "terms and conditon updated successfully",
        result: {},
      });
    }
    const createNewTermsConditions = new TermsCondition({
      title,
      content,
    });
    await createNewTermsConditions.save();
    return res.send({
      statuscode: 200,
      success: true,
      message: "terms and conditon created successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in create terms and condition api",
      result: error,
    });
  }
};

exports.getTermsAndCondition = async (req, res) => {
  try {
    let token = req.body;

    const admin = await Admin.find({_id:token._id, status:"Active"})
    const user = await User.find({_id:token._id,status:"Active"})
    if(!(admin || user)){
        return res.send({
            statusCode:404,
            success:false,
            message:" Unauthorise access",
            result:{}
        })
    }
    const termAndConditions = await TermsCondition.findOne();
    if (!termAndConditions) {
      return res.send({
        statusCode: 404,
        success: true,
        message: "Terms & Conditions not found",
        result: {},
      });
    }

    return res.send({
      statusCode: 200,
      success: true,
      message: "Terms & Conditions fetched successfully",
      result: {termAndConditions},
    });

    
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get terms and condition api",
      result: error,
    });
  }
};
