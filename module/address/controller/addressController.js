const Address = require("../../address/model/addressModel");
const User = require("../../user/model/userModel");
const generateJWT = require("../../../middlewares/jwt");
const Admin = require("../../admin/model/adminModel");

exports.createCompleteAddress = async (req, res) => {
  try {
    let token = req.token;
    let { completeAddress, floorNumber } = req.body;
    if (!completeAddress) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "complete address required",
        result: {},
      });
    }
    if (!floorNumber) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "floor number required",
        result: {},
      });
    }
    // if(!howToReach){
    //     return res.send({
    //         statusCode:400,
    //         success:false,
    //         message:"how to reach required",
    //         result:{}
    //     })
    // }

    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has been deleted",
        result: {},
      });
    }
    if (user.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has bloked",
        result: {},
      });
    }
    createNewCompleteAddress = new Address({
      userId:user._id,
      completeAddress,
      floorNumber,
      // howToReach,
    });

    await createNewCompleteAddress.save();

    return res.send({
      statusCode: 200,
      success: true,
      message: "Complete adress created successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in create complete address",
      result: {},
    });
  }
};

exports.editAdress = async (req, res) => {
  try {
    let token = req.token;
    let { AddressId } = req.params;
    let { completeAddress, floorNumber, howToReach } = req.body;
    if (!AddressId) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "address id required",
        result: {},
      });
    }
    if (!completeAddress) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "required complete adress",
        result: {},
      });
    }
    if (!floorNumber) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "floor number required",
        result: {},
      });
    }

    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has been deleted",
        result: {},
      });
    }
    if (user.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has blocked",
        result: {},
      });
    }

    const address = await Address.findOne({ _id: AddressId });
    if (!address) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "address not found",
        result: {},
      });
    }
    if (address.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "address has been deleted",
        result: {},
      });
    }
    address.completeAddress = completeAddress;
    address.floorNumber = floorNumber;
    address.howToReach = howToReach;

    await address.save();

    return res.send({
      statusCode: 400,
      success: true,
      message: "address updated successfully",
      result: { address },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in edit address API",
      result: {},
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    let token = req.token;
    let { AddressId } = req.params;
    if (!AddressId) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "address id required",
        result: {},
      });
    }

    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    if (user.status == "delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has been deleted",
        result: {},
      });
    }
    if (user.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user has blocked",
        result: {},
      });
    }

    const address = await Address.findOne({ _id: AddressId });
    if (!address) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "address not found",
        result: {},
      });
    }
    if (address.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "address already deleted",
        result: {},
      });
    }

    address.status = "Delete";

    await address.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "address deleted successfully",
      result: { address },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in delete address API",
      result: {},
    });
  }
};
exports.getAllAddress = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;

    const admin = await Admin.findOne({ _id: token._id, status: "Active" });
    // if (!admin) {
    //   return res.send({
    //     statusCode: 404,
    //     success: false,
    //     message: "Unauthorized access",
    //     result: {},
    //   });
    // }
    // const user = await User.findOne({ _id: token._id, status: "Active" });
    if (! admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized access",
        result: {},
      });
    }
    const allAddress = await Address.find({  })
      .skip(skip)
      .limit(limit);

    const totalAddress = await Address.countDocuments({  });

    return res.send({
      statusCode: 200,
      success: true,
      message: "All Address get successfully",
      result: {
        Address: allAddress,
        currentPage: page,
        totalPage: Math.ceil(totalAddress / limit),
        totalRecord: totalAddress,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in get all address API",
      result: error,
    });
  }
};


exports.getAllAddressbyUser = async (req, res) => {
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
    const allAddress = await Address.find({ userId: token._id})
      .skip(skip)
      .limit(limit);
    const totalAddress = await Address.countDocuments({ userId: token._id});
    return res.send({
      statusCode: 200,
      success: true,
      message: "All Address get successfully",
      result: {
        Address: allAddress,
        currentPage: page,
        totalPage: Math.ceil(totalAddress / limit),
        totalRecord: totalAddress,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in get all address API",
      result: error,
    });
  }
};