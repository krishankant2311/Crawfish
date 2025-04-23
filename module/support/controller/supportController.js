const Support = require("../model/supportModel");
const User = require("../../user/model/userModel");

const Admin = require("../../admin/model/adminModel");

const Restaurant = require("../../restaurants/model/restaurantModel");
// exports.createsupport = async(req,res) => {
//     try {
//         let token = req.token
//         let {title,description} = req.body;
//         let {restaurantId} = req.params;
//         title = title?.trim()
//         description = description?.trim()
//         // if(userId){
//         //     return res.send({
//         //         statusCode:400,
//         //         success:false,
//         //         message:"Required userId",
//         //         result:{}
//         //     })
//         // }
//         if(!restaurantId){
//             return res.send({
//                 statusCode:400,
//                 success:true,
//                 message:"Required restaurant id",
//                 result:{}
//             })
//         }
//         if(!title){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"Required title",
//                 result:{}
//             })
//         }
//         if(!description){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"Required description",
//                 result:{}
//             })
//         }

//         const user = await User.findOne({_id:token._id})
//         if(!user){
//             return res.send({
//                 statusCode : 404,
//                 success:false,
//                 message:"user not found",
//                 result:{}
//             })
//         }
//         if(user.status === "Delete"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"user has been blocked",
//                 result:{}
//             })
//         }
//         if(user.status === "Block"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"user has been blocked",
//                 result:{}
//             })
//         }
//         if(user.status === "Pending"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"unauthorise access",
//                 result:{}
//             })
//         }

//         const restaurant = await Restaurant.findOne({_id:restaurantId})
//         if(!restaurant){
//             return res.send({
//                 statusCode:404,
//                 success:false,
//                 message:"restaurant not found",
//                 result:{}
//             })
//         }
//         if(restaurant.status === "Delete"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"Restaurant has been deleted",
//                 result:{}
//             })
//         }
//         if(restaurant.status === "Pending"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"unauthorise access",
//                 result:{}
//             })
//         }

//         if(restaurant.status === "Block"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"restaurant has been blocked",
//                 result:{}
//             })
//         }
//          const newSupport = new Support({
//             title,
//             description,
//             userId:token._id,
//             restaurantId:restaurantId,
//          })
//          if(!newSupport){
//             return res.send({
//                 statusCode:404,
//                 success:false,
//                 message:"new support are not found",
//                 result:{}
//             })
//          }

//          await newSupport.save()
//          return res.send({
//             statusCode:200,
//             success:true,
//             message:"support create successfully",
//             result:{}
//          })
//     } catch (error) {
//         return res.send({
//             statusCode:500,
//             success:false,
//             message:error.message + " ERROR in create support api",
//             result:{}
//         })
//     }
// }

// exports.getsupport = async(req,res) => {
//     try {
//         let token = req.token ;
//          let userId = token._id;
//         let {restaurantId} = req.params;

//         if(!restaurantId){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"Required restaurant Id",
//                 result:{}
//             })
//         }
//         const user = await User.findOne({_id:userId})
//         if(!user){
//             return res.send({
//                 statusCode:404,
//                 success:false,
//                 message:"user not found",
//                 result:{}
//             })
//         }
//         if(user.status === "Block"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"user has been blocked",
//                 result:{}
//             })
//         }
//         if(user.status === "Delete"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"user has been delete",
//                 result:{}
//             })
//         }
//         if(user.status === "Pending"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"unauthorise access",
//                 result:{}
//             })
//         }

//         const restaurant = await Restaurant.findOne({ _id: restaurantId });
//         if(!restaurant){
//             return res.send({
//                 statusCode:404,
//                 success:false,
//                 message:"restaurant not found",
//                 result:{}
//             })
//         }
//         if(restaurant.status === "Block"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"restaurant has been blocked",
//                 result:{}
//             })
//         }
//         if(restaurant.status === "Delete"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"restaurant has been delete",
//                 result:{}
//             })
//         }
//         if(restaurant.status === "Pending"){
//             return res.send({
//                 statusCode:400,
//                 success:false,
//                 message:"unauthorise access",
//                 result:{}
//             })
//         }

//         const support = await Support.findOne({userId,restaurantId})
//         if(!support){
//             return res.send({
//                 statusCode:404,
//                 success:false,
//                 message:"support not found",
//                 result:{}
//             })
//         }

//         return res.send({
//             statusCode:200,
//             success:true,
//             message:"support fetch successfully",
//             result:{support}
//         })

//     } catch (error) {
//         return res.send({
//             statusCode:500,
//             success:false,
//             message : error.message + " ERROR in get support api",
//             result:{}
//         })
//     }
// }

exports.createSupportbyUser = async (req, res) => {
  try {
    let token = req.token;
    userId = token._id;
    let { title, description } = req.body;
    if (!title) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required title",
        result: {},
      });
    }
    if (!description) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required description",
      });
    }
    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has been blocked",
        result: {},
      });
    }
    if (user.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has been delete",
        result: {},
      });
    }
    if (user.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }

    const createsupport = new Support({
      title,
      description,
      userId,
    });
    if (createsupport) {
      user.userId = token._id;
      createsupport.save();
      return res.send({
        statusCode: 200,
        success: true,
        message: "support create successfully by user",
        result: {},
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in create support api by user",
      result: {},
    });
  }
};

exports.createSupportbyRestaurant = async (req, res) => {
  try {
    let token = req.token;
    restaurantId = token._id;
    let { title, description } = req.body;
    if (!title) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required title",
        result: {},
      });
    }
    if (!description) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Required description",
      });
    }
    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been blocked",
        result: {},
      });
    }
    if (restaurant.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been delete",
        result: {},
      });
    }
    if (restaurant.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }

    const createsupport = new Support({
      title,
      description,
      restaurantId: restaurantId,
    });
    if (createsupport) {
      createsupport.save();
      return res.send({
        statusCode: 200,
        success: true,
        message: "support create successfully by restaurant",
        result: {},
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in create support api by restaurant",
      result: {},
    });
  }
};

exports.getsupportbyAdmin = async (req, res) => {
  try {
    let token = req.token;

    const admin = await Admin.findOne({ _id: token._id });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Admin not found",
        result: {},
      });
    }

    if (admin.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin has been deleted",
        result: {},
      });
    }
    if (admin.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "admin has been blocked",
        result: {},
      });
    }
    if (admin.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    const support = await Support.find({});

    if (!support) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "support not found",
        result: {},
      });
    }
    return res.send({
      statyuscode: 200,
      success: true,
      message: "support fetch successfully",
      result: { support },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get support api by admin",
      result: {},
    });
  }
};

exports.getsupportbyUser = async (req, res) => {
  try {
    let token = req.token;

    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has been blocked",
        result: {},
      });
    }
    if (user.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has been blocked",
        result: {},
      });
    }
    if (user.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }

    const support = await Support.findOne({ userId: token._id });
    if (!support) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "support not found",
        result: {},
      });
    }

    return res.send({
      statusCode: 200,
      success: true,
      message: "support fetch successfully",
      result: {support},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get support by user api",
      result: {},
    });
  }
};

exports.getsupportbyRestaurant = async (req, res) => {
  try {
    let token = req.token;
    let { _id } = req.params;
    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status === "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been blocked",
        result: {},
      });
    }
    if (restaurant.status === "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been blocked",
        result: {},
      });
    }
    if (restaurant.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }

    const support = await Support.findOne({ restaurantId: token._id });
    if (!support) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "support not found",
        result: {},
      });
    }

    return res.send({
      statusCode: 200,
      success: true,
      message: "support fetch successfully",
      result: { support },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get support by user api",
      result: {},
    });
  }
};

exports.updateSupportbyadmin = async (req, res) => {
  try {
    let token = req.token;
    let _id =req.params;
    const admin = await Admin.findOne({ _id: token._id, status: "Active" });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "admin not found",
        result: {},
      });
    }

    const support = await Support.findOne({ _id });
    if (!support) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Support not found",
        result: {},
      });
    }
    if (support.status === "Solved") {
      return res.send({
        statusCode: 400,
        message: "support already solved",
        result: {},
      });
    }
    support.status = "Solved";
    support.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "support solved successfully",
      result: { support },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in update support api by admin",
      result: {},
    });
  }
};


