const FAQ = require("../model/FAQmodel");
const Admin = require("../../admin/model/adminModel");
const { verify } = require("jsonwebtoken");
const { verifyJWT } = require("../../../middlewares/jwt");
const User = require("../../user/model/userModel")

exports.createFAQ = async (req, res) => {
  try {
    let { question, answer } = req.body;
    let token = req.token;

    // console.log(token)

    if (!question) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Question required",
        result: {},
      });
    }

    if (!answer) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Answer required",
        result: {},
      });
    }

    const admin = await Admin.findOne({_id:token._id});
    // console.log(admin)
    if (!admin) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin not found",
        result: {},
      });
    }
    if (admin.status == "Delete") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Admin account has been deleted",
        result: {},
      });
    }
    if (admin.status == "Block") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Admin account has been blocked",
        result: {},
      });
    }

    const faq = await FAQ.findOne({
      question: { $regex: question, $options: "i" },
    });

    if (faq) {
if(faq.status==="Active"){
    return res.send({
        statusCode:403,
        success:false,
        message:"faq already exist",
        result:{}
    })
}

      if (faq.status == "Delete") {
        (faq.question = question), (faq.answer = answer);
        faq.status = "Active";
      }

      await faq.save();

      return res.send({
        statusCode: 200,
        success: true,
        message: "faq created successfully",
        result: {},
      });
    }

    const createNewFAQ = new FAQ({
      question,
      answer,
      status: "Active",
    });
    await createNewFAQ.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Faq create succesfully",
      result: {},
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "Error in CreateFAQ",
      result: {},
    });
  }
};

// exports.findFAQ = async (req, res) => {
//     try {
//         let{question} = req.body
//          question = question?.trim()
//         if(!question) {
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"Question required",
//                 result:{}
//             })
//         }
//         const findFAQ = await FAQ.findOne({question})
//         if(!findFAQ){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"faq not found",
//                 result:{}
//             })
//         }
//         return res.send({
//             statusCode:200,
//             success:true,
//             message:"FAQ find successfully",
//             result:{findFAQ}
//         })
//     } catch (error) {
//         return res.send({
//             statusCode:500,
//             success:false,
//             message:error.message + "Error in Find FAQ API",
//             result:{}
//         })
//     }
// }

exports.editFAQ = async (req, res) => {
  try {
    let token = req.token;
    let { faqId } = req.body;
    console.log(faqId);
    let { question, answer, status } = req.body;
    if (!faqId) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "FAQ id required",
        result: {},
      });
    }
    if (!question) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Question required",
        result: {},
      });
    }
    if (!answer) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Answer required",
        result: {},
      });
    }
    if (!status) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "status required",
        result: {},
      });
    }

    const admin = await Admin.findOne({_id:token._id});

    if (!admin) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin not found",
        result: {},
      });
    }
    if (admin.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "your account has been deleted",
        result: {},
      });
    }

    const faq = await FAQ.findOne({ _id: faqId });
    // console.log(faq);

    if (!faq) {
      return res.send({
        statusCode: 403,
        success: false,
        message: "FAQ not found",
        result: {},
      });
    }
    if (faq.status == "Delete" && status == "Delete") {
      return res.send({
        statusCode: 404,
        success: false,
        message: "FAQ already deleted",
        result: {},
      });
    }
    faq.question = question;
    faq.answer = answer;
    faq.status = status;

    await faq.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "FAQ edited successfully",
      result: { faq },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in editfaq API",
      result: {},
    });
  }
};

exports.getFAQ = async (req, res) => {
  try {
    let token = req.token;
    let faqId = req.params.id;
    // console.log(faqId);
    if (!faqId) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "faqId is required",
        result: {},
      });
    }
    // const decodedToken = await verifyJWT(token,JWT_SECRET_KEY)
    const admin = await Admin.findOne({_id:token._id});
    if (!admin) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    if (admin.status == "Delete") {
      return res.send({
        statusCode: 404,
        successs: false,
        message: "admin already deleted",
        result: {},
      });
    }
    if (admin.status == "Block") {
      return res.send({
        statusCode: 403,
        success: false,
        messsage: "admin has blocked",
        result: {},
      });
    }
    const faq = await FAQ.findOne({ _id: faqId });
    if (!faq) {
      return res.send({
        statusCode: 403,
        success: false,
        message: "faq not found",
        result: {},
      });
    }
    if (faq.status == "Delete") {
      return res.send({
        statusCode: 404,
        success: false,
        message: "faq has been deleted",
        result: {},
      });
    }
    return res.send({
      statusCode: 200,
      success: true,
      message: "faq find successfully",
      result: { faq },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in getfaq API",
      result: {},
    });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    let token = req.token;
    let { faqId } = req.body;
    if (!faqId) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "faqId is required",
        result: {},
      });
    }
    const admin = await Admin.findOne({_id:token._id});
    if (!admin) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin not found ",
        result: {},
      });
    }
    if (admin.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Admin has been deleted ",
        result: {},
      });
    }
    if (admin.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin has been bloked",
        result: {},
      });
    }
    const faq = await FAQ.findOne({ _id: faqId });
    if (!faq) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Faq not found",
        result: {},
      });
    }
    if (faq.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "faq already deleted",
        result: {},
      });
    }

    faq.status = "Delete";

    await faq.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "faq deleted successfully",
      result: { faq },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in deletedfaq API",
      result: {},
    });
  }
};
exports.getAllFAQ = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;

    const admin = await Admin.findOne({ _id: token._id, status: "Active" });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized access",
        result: {},
      });
    }
    //   const user = await User.findOne({ _id: token._id, status: "Active" });
    //   if (!(user || admin)) {
    //     return res.send({
    //       statusCode: 404,
    //       success: false,
    //       message: "Unauthorized access",
    //       result: {},
    //     });
    //   }
    if (admin.status === "Delete") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been deleted",
        result: {},
      });
    }
    const allFAQ = await FAQ.find({ status: "Active" }).skip(skip).limit(limit);

    const totalFAQ = await FAQ.countDocuments({ status: "Active" });

    return res.send({
      statusCode: 200,
      success: true,
      message: "All FAQ get successfully",
      result: {
        FAQ: allFAQ,
        currentPage: page,
        totalPage: Math.ceil(totalFAQ / limit),
        totalRecord: totalFAQ,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in get all faq api",
      result: error,
    });
  }
};

exports.getAllFAQByUser = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;

    const user = await User.findOne({ _id: token._id, status: "Active" });
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized access",
        result: {},
      });
    }
    //   const user = await User.findOne({ _id: token._id, status: "Active" });
    //   if (!(user || admin)) {
    //     return res.send({
    //       statusCode: 404,
    //       success: false,
    //       message: "Unauthorized access",
    //       result: {},
    //     });
    //   }
    if (user.status === "Delete") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "Your account has been deleted",
        result: {},
      });
    }
    const allFAQ = await FAQ.find({ status: "Active" }).skip(skip).limit(limit);

    const totalFAQ = await FAQ.countDocuments({ status: "Active" });

    return res.send({
      statusCode: 200,
      success: true,
      message: "All FAQ get successfully",
      result: {
        FAQ: allFAQ,
        currentPage: page,
        totalPage: Math.ceil(totalFAQ / limit),
        totalRecord: totalFAQ,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in get all faq api",
      result: error,
    });
  }
};
