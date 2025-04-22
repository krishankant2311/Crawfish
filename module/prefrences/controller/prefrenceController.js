const Prefrence = require("../../prefrences/model/prefrenceModel");

const User = require("../../user/model/userModel");

const Admin = require("../../admin/model/adminModel");
const path = require("path")

exports.createpreferences = async (req, res) => {
  try {
    let token = req.token;
    let {  name, title, content } = req.body;
    let image = req.file ? req.file.path : null;

    name = name?.trim();

    // if(!name){
    //     return res.send({
    //         statusCode:400,
    //         success:false,
    //         message:"Required name",
    //         result:{}
    //     })
    // }
    if (!title) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required title",
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
        success: true,
        message: "Admin not found",
      });
    }
    if (admin.status === "Delete") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "admin has been deleted",
        result: {},
      });
    }
    if (admin.status === "Pending" || admin.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }

    const preference = await Prefrence.findOne({
      title: title,
      content: content,
    });
    if (preference) {
      return res.send({
        statusCode: 401,
        success: false,
        message: "preference already exist",
        result: {},
      });
    }

    const createNewPreference = new Prefrence({
      adminId: token._id,
      name: admin.adminName,
      title,
      content,
     image,
      
    });
    if (createNewPreference) {
      await createNewPreference.save();
      return res.send({
        statusCode:200,
        success: true,
        message: "preference created successfully",
        result: { createNewPreference },
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in create prefrence api",
      result: {},
    });
  }
};
exports.updatePreferences = async (req, res) => {
  try {
    let token = req.token;
    let {  name, title, content } = req.body;
    let image = req.file ? req.file.path : null;

    let {preferenceId} = req.params;

    //  if(!name){
    //     return res.send({
    //         statusCode:400,
    //         success:false,
    //         message:"Required name"
    //     })
    //  }
    if (!title) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required title",
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
        statusCode: 400,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }
    if (admin.status === "Delete") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "admin has been deleted",
        result: {},
      });
    }
    if (admin.status === "Pending" || admin.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }

    const preference = await Prefrence.findOne({ _id: preferenceId });
    if (!preference) {
      return res.send({
        statusCode: 404,
        succes: false,
        message: "preference not found",
        result: {},
      });
    }

    if (image) preference.image = image;
    if (name) preference.name = admin.name;
    preference.title = title;
    preference.content = content;
    // preference.time = Date.now() - preference.updatedAt;
    await preference.save();

    return res.send({
      statusCode: 200,
      success: true,
      message: "preference updated successfully",
      result: { preference },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      succes: false,
      message: error.message + " ERROR in update preference api",
      result: {},
    });
  }
};

exports.getpreferences = async (req, res) => {
  try {
    let token = req.token;
    let { preferenceId } = req.params;

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
        message: "admin account has been deleted",
        result: {},
      });
    }
    if (admin.status === "Pending" || admin.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    const preference = await Prefrence.findOne({ _id: preferenceId });
    if (!preference) {
      return res.send({
        statusCode: 404,
        succes: false,
        message: "preference not found",
        result: {},
      });
    }
    if(preference.status==="Delete"){
        return res.send({
            statusCode:400,
            success:false,
            message:"preference has been deleted",
            result:{}
        })
    }
    return res.send({
      statusCode: 200,
      success: true,
      message: "Preference get successfully",
      result: { preference },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " Error in get preference api",
      result: {},
    });
  }
};
exports.deletePreference = async (req, res) => {
  try {
    let token = req.token;
    let {preferenceId} = req.params;
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
        message: "admin has been deleted",
        result: {},
      });
    }
    if (admin.status === "Pending" || admin.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    const preference = await Prefrence.findOne({ _id: preferenceId });
    if (!preference) {
      return res.send({
        statusCode: 404,
        succes: false,
        message: "preference not found",
        result: {},
      });
    }
    if (preference.status === "Delete") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "preference already deleted",
        result: {},
      });
    }

    preference.status = "Delete";
    await preference.save()
    return res.send({
        statusCode:200,
        success:true,
        message:"Preference delete successfully",
        result:{}
    })
  } catch (error) {
    return res.send({
        statusCode:500,
        success:false,
        message:error.message + " ERROR in delete preference api",
        result:{}
    })
  }
};
exports.getAllActivePrefernce = async(req,res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;

    const user = await User.findOne({_id: token._id, status: "Active"})
    const admin = await Admin.findOne({ _id: token._id, status: "Active" });
    if (!(admin || user)) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized access",
        result: {},
      });
    }

    const allPreferences = await Prefrence.find({ status: "Active" })
      .skip(skip)
      .limit(limit);

    const totalPreference = await Prefrence.countDocuments({
      status: "Active",
    });

    return res.send({
      statusCode: 200,
      success: true,
      message: "All Prefrence get successfully",
      result: {
        Prefrence: allPreferences,
        currentPage: page,
        totalPage: Math.ceil(totalPreference / limit),
        totalRecord: totalPreference,
      },
    });
  } catch (error) {
    return res.send({
      statusCode:500,
      success:false,
      message:error.message + " ERROR in get all preference api",
    result:{}   
  })
  }
}
exports.getAllPrefernces = async(req,res) => {
  try {
    let token = req.token;
    let{page = 1, limit = 10} = req.query
    page = Number.parseInt(page)
    limit = Number.parseInt(limit);
    let skip = (page-1) * limit ;
    const user = await User.findOne({_id:token._id})
    if(!user){
      return res.send({
        statusCode:404,
        success:false,
        message:"user not found",
        result:{}
      })
    }
    if(user.status === "Delete"){
      return res.send({
        statusCode:400,
        success:false,
        message:"user has been deleted",
        result:{}
      })
    }
    if(user.status === "Pending" || user.status === "Block"){
      return res.send({
        statusCode:400,
        success:false,
        message:"unauthorise access",
        result:{}
      })
    }
    const allPreferences = await Prefrence.find({}).skip(skip).limit(limit)
    const totalPreference = await Prefrence.countDocuments({
      // status: "Active",
    });
    if(!allPreferences){
      return res.send({
        statusCode:404,
        success:false,
        message:"preference not found",
        result:{}
      })
    }
    if(allPreferences.status === "Delete"){
      return res.send({
        statusCode:401,
        success:false,
        message:"preference has been deleted",
        result:{}
      })
    }
    return res.send({
      statusCode: 200,
      success: true,
      message: "All Prefrence get successfully",
      result: {
        totalPreference: allPreferences,
        currentPage: page,
        totalPage: Math.ceil(totalPreference / limit),
        totalRecord: totalPreference,
      },
    });

  } catch (error) {
    return res.send({
      statusCode:500,
      success:false,
      message:error.message + " ERROR in get all preference ",
      result:{}
    })
  }
}