const User = require("../../user/model/userModel")
const Restaurant = require("../../restaurants/model/restaurantModel")

const RestaurantAddress = require("../model/restaurantAddressModel");
// const restaurantAddress = require("../model/restaurantAddressModel");
const Admin = require("../../admin/model/adminModel");
const { getRestaurant } = require("../../restaurants/controller/restaurantController");


exports.createCompleteAddress = async (req, res) => {
  try {
    let token = req.token;
    let { completeAddress, type } = req.body;
    if (!completeAddress) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "complete address required",
        result: {},
      });
    }
    if (!type) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Adress type required",
        result: {},
      });
    }
  
    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been deleted",
        result: {},
      });
    }
    if (restaurant.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has bloked",
        result: {},
      });
    }
    createNewCompleteAddress = new RestaurantAddress({
      restaurantId:restaurant._id,
      completeAddress,
      type,
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
    let { completeAddress, type } = req.body;
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
    if (!type) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "address type required",
        result: {},
      });
    }

    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant not found",
        result: {},
      });
    }
    if (restaurant.status == "Delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been deleted",
        result: {},
      });
    }
    if (restaurant.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has blocked",
        result: {},
      });
    }

    const address = await RestaurantAddress.findOne({ _id: AddressId });
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
    address.type = type;
    // address.howToReach = howToReach;

    await address.save();

    return res.send({
      statusCode: 200,
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

    const restaurant = await Restaurant.findOne({ _id: token._id });
    if (!restaurant) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "unauthorise access",
        result: {},
      });
    }
    if (restaurant.status == "delete") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has been deleted",
        result: {},
      });
    }
    if (restaurant.status == "Block") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurant has blocked",
        result: {},
      });
    }
    if (restaurant.status == "Pending") {
        return res.send({
          statusCode: 400,
          success: false,
          message: "unauthorise access",
          result: {},
        });
      }
  

    const address = await RestaurantAddress.findOne({ _id: AddressId, status:"Active" });
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
exports.getAllAddressByAdmin = async (req, res) => {
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
    const allAddress = await RestaurantAddress.find({  })
      .skip(skip)
      .limit(limit);

    const totalAddress = await RestaurantAddress.countDocuments({   });

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



exports.getAllAddressbyRestaurant = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;
    const restaurant = await Restaurant.findOne({ _id: token._id, status: "Active" });
    if (!restaurant) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized access",
        result: {},
      });
    }
    const allAddress = await RestaurantAddress.find({ restaurantId: token._id, status:"Active"})
      .skip(skip)
      .limit(limit);
    const totalAddress = await RestaurantAddress.countDocuments({ restaurantId: token._id , status:"Active"});
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

exports.getRestaurantAddressByUser = async(req,res) => {
    try {
        let token = req.token;
        const { restaurantId, AddressId } = req.params;
        // let {AddressId} = req.params
        if(!restaurantId){
            return res.send({
                statusCode:400,
                success:false,
                message:"Required restaurantId",
                result:{}
            })
        }
        if(!AddressId){
            return res.send({
                statusCode:400,
                success:false,
                message:"Required AddressId",
                result:{}
            })
        }
        const user = await User.findOne({_id:token._id, status:"Active"})
        if(!user){
            return res.send({
                statusCode:404,
                success:false,
                message:"user not found",
                result:{}
            })
        }

        const restaurant = await Restaurant.findOne({_id:restaurantId, status:"Active"})
        if(!restaurant){
            return res.send({
                statusCode:404,
                success:false,
                message:"restaurant Id found",
                result:{}
            })
        }
        const restAddress = await RestaurantAddress.findOne({_id:AddressId,restaurantId:restaurantId,status:"Active"})
        if(!restAddress){
            return res.send({
                statusCode:404,
                success:false,
                message:"restaurant address not found",
                result:{}
            })
        }
        return res.send({
            statusCode:200,
            success:true,
            message:"restaurant address fetch successfully",
            result:restAddress
        })
    } catch (error) {
        return res.send({
            statusCode:500,
            success:false,
            message:error.message + " ERROR in get restaurant address by user ",
            result:{}
        })
    }
}