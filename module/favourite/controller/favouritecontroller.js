const User = require("../../user/model/userModel")
const Restaurant = require("../../restaurants/model/restaurantModel")
const Favourite = require("../../favourite/model/favouritemodel")
exports.addfavourite = async(req,res) => {
    try {
        let token = req.token;
        let {resId} = req.params

        const user = await User.findOne({_id:token._id})
        if(!user){
            return res.send({
                statusCode:400,
                success:false,
                message:"user not found",
                result:{}
            })
        }
        if(user.status==="delete"){
            return res.send({
                statusCode:400,
                success:false,
                message:"user has been deleted",
                result:{}
            })
        }
        if(user.status==="Pending"||user.status==="Block"){
            return res.send({
                statusCode:400,
                success:false,
                message:"Inactive user",
                result:{}
            })
        }
       

        const restaurant = await Restaurant.findOne({ _id: resId });
        if(!restaurant){
            return res.send({
                statusCode:404,
                success:false,
                message:"Restaurant not found",
                result:{}
            })
        }
        if(!restaurant.status==="Delete") {
            return res.send({
                statusCode:400,
                success:false,
                message:"restaurant has been deleted",
                result:{}
            })
        }

        if(restaurant.status === "Pending" || restaurant.status === "Block"){
            return res.send({
                statusCode:401,
                success:false,
                message:"Inactive restaurant",
                result:{}
            })
        }
        const favourite = await Favourite.findOne({userId:token._id,
            restaurantId:resId});
        // console.log("fav",favourite)
    if (favourite) {
       if(favourite.status==="Active"){
      return res.send({
        statusCode: 400,
        success: false,
        message: " already added to favourite",
        result: {},
      });
    }
    if(favourite.status==="Inactive"){
        favourite.status = "Active"
        favourite.isFavourite = "true"
        await favourite.save()
        return res.send({
            statusCode:200,
            success:true,
            message:"add to favourite successfully",
            result:{}
        })
    }
}
    const newfavourite = new Favourite({
     userId:token._id,
     restaurantId: resId,
     isFavourite:true,
    });
    await newfavourite.save();
    return res.send({
      statuscode: 200,
      success: true,
      message: "fav add successfully",
      result: {},
    });
    } catch (error) {
        return res.send({
            statusCode:500,
            success:false,
            message:error.message + " ERROR in add favourite restaurant",
            result:{}
        })
    }
}

exports.getAllFavouriteRestaurant = async(req,res) => {
    try {
        const token = req.token;
        // let {resId} = req.params;

        const user = await User.findOne({_id:token._id})
        if(!user){
            return res.send({
                statusCode:404,
                success:false,
                message:"User not found",
                result:{}
            })
        }
        if(user.status==="Delete"){
            return res.send({
                statusCode:400,
                success:false,
                message:"user has been deleted",
                result:{}
            })
        }
        if(user.status==="Pending"||user.status==="Block"){
            return res.send({
                statusCode:400,
                success:false,
                message:"Inactive user",
                result:{}
            })
        }

        const restaurant = await Restaurant.find({ status:"Active" }).select("-token -otp -phoneNumber -password -securityToken");
        if(!restaurant){
            return res.send({
                statusCode:404,
                success:false,
                message:"Restaurant not found",
                result:{}
            })
        }
        if(!restaurant.status==="Delete") {
            return res.send({
                statusCode:400,
                success:false,
                message:"restaurant has been deleted",
                result:{}
            })
        }

        if(restaurant.status === "Pending" || restaurant.status === "Block"){
            return res.send({
                statusCode:401,
                success:false,
                message:"Inactive restaurant",
                result:{}
            })
        }
        const favourite = await Favourite.find({ status:"Active", isFavourite:"true"})
        if(!favourite){
            return res.send({
                statusCode:404,
                success:false,
                message:"favourite restaurant not found",
                result:{}
            })

    }
    return res.send({
        statusCode:200,
        success:true,
        message:"restaurant get successfully",
        result:{favourite}
    })
  

    } catch (error) {
        return res.send({
            statusCode:500,
            success:false,
            message:error.message + " ERROR in get favourite restaurant api",
            result:{}
        })
    }
}

exports.deleteFavouriteRestaurant = async(req,res) => {
    try {
        let token = req.token;
        let {resId} = req.params;
        

        const user = await User.findOne({_id:token._id})
        if(!user){
            return res.send({
                statusCode:404,
                success:false,
                message:"User not found",
                result:{}
            })
        }
        if(user.status==="delete"){
            return res.send({
                statusCode:400,
                success:false,
                message:"user has been deleted",
                result:{}
            })
        }
        if(user.status==="Pending"||user.status==="Block"){
            return res.send({
                statusCode:400,
                success:false,
                message:"Inactive user",
                result:{}
            })
        }
        const restaurant = await Restaurant.findOne({_id:resId})
        if(!restaurant){
            return res.send({
                statusCode:404,
                success:false,
                message:"Restaurant not found",
                result:{}
            })
        }
        if(!restaurant.status==="Delete") {
            return res.send({
                statusCode:400,
                success:false,
                message:"restaurant has been deleted",
                result:{}
            })
        }

        if(restaurant.status === "Pending" || restaurant.status === "Block"){
            return res.send({
                statusCode:401,
                success:false,
                message:"Inactive restaurant",
                result:{}
            })
        }
        const favourite = await Favourite.findOne({restaurantId:resId})
        if(!favourite){
            return res.send({
                statusCode:404,
                success:false,
                message:"favourite restaurant not found",
                result:{}
            })
    }
    if(favourite.status==="Inactive"){
        return res.send({
            statusCode:400,
            success:false,
            message:"favourite restaurant has already deleted",
            result:{}
        })
    }

    favourite.status = "Inactive"
    favourite.isFavourite = "false"
    await favourite.save()
    return res.send({
        statuscode:200,
        success:true,
        message:"restaurant delete successfully",
        result:{}
    })

    } catch (error) {
        return res.send({
            statusCode:500,
            success:false,
            message:error.message + " ERROR in delete favourite restaurant",
            result:{}
        })
    }
}

exports.getfavouriteRestaurant = async(req,res) => {
    try {
        let token = req.token
        let {resId} = req.params

        const user = await User.findOne({_id:token._id})
        if(!user){
            return res.send({
                statusCode:400,
                success:false,
                message:"user not found",
                result:{}
            })
        }
        if(user.status==="delete"){
            return res.send({
                statusCode:400,
                success:false,
                message:"user has been deleted",
                result:{}
            })
        }
        if(user.status==="Pending"||user.status==="Block"){
            return res.send({
                statusCode:400,
                success:false,
                message:"Inactive user",
                result:{}
            })
        }
       

        const restaurant = await Restaurant.findOne({ _id: resId });
        if(!restaurant){
            return res.send({
                statusCode:404,
                success:false,
                message:"Restaurant not found",
                result:{}
            })
        }
        if(!restaurant.status==="Delete") {
            return res.send({
                statusCode:400,
                success:false,
                message:"restaurant has been deleted",
                result:{}
            })
        }

        if(restaurant.status === "Pending" || restaurant.status === "Block"){
            return res.send({
                statusCode:401,
                success:false,
                message:"Inactive restaurant",
                result:{}
            })
        }
        const favourite = await Favourite.findOne({restaurantId:resId})
        if(!favourite){
            return res.send({
                statusCode:404,
                success:false,
                message:"favourite restaurant not found",
                result:{}
            })
        }
        if(favourite.status==="Inactive"){
            return res.send({
                statusCode:404,
                success:false,
                message:"favourite restaurant has been deleted",
                result:{}
            })
        }
        return res.send({
            statusCode:200,
            success:true,
            message:"restaurant find successfully",
            result:{favourite}
        })
    } catch (error) {
        
    }
}