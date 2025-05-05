const Review = require("../model/reviewModel");
const generateJWT = require("../../../middlewares/jwt");
const User = require("../../user/model/userModel");
const Admin = require("../../admin/model/adminModel");
const Restaurant = require("../../restaurants/model/restaurantModel");
const mongoose = require("mongoose");
exports.createReview = async (req, res) => {
  try {
    let token = req.token;
    // let userId = token._id;
    let {restaurantId} = req.params
    let { rating, content } = req.body;
    // if(!userId){
    //     return res.send({
    //         statusCode:400,
    //         success:false,
    //         message:"userId required",
    //         result:{}
    //     })
    // }
    let photos =req.file ? req.file.path : null;
    if (!restaurantId) {
      return res.send({
        statusCode: 400,
        successs: false,
        message: "restaurantId required",
        result: {},
      });
    }
    if (!rating) {
      return res.send({
        statusCode: 400,
        successs: false,
        message: "Rating required",
        result: {},
      });
    }
    if (rating < 1 || rating > 5) {
      return res.send({
        statusCode:400,
        success: false,
        message: "Rating must be a number between 1 and 5",
        result: {},
      });
    }
    if (!content) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Content required",
        result: {},
      });
    }
    

    const user = await User.findOne({ _id: token._id });

    if (!user) {
      return res.send({
        statusCode: 403,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status == "Delete") {
      return res.send({
        statusCode: 404,
        success: false,
        message: "user has been deleted",
        result: {},
      });
    }
    if (user.status == "Block") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "user has blocked",
        result: {},
      });
    }
    const restaurant = await Restaurant.findById(restaurantId)
    if(!restaurant){
      return res.send({
        statusCode:404,
        success:false,
        message:"restaurant not found",
        result:{}
      })
    }
    if(restaurant.status === "Delete"){
      return res.send({
        statusCode:400,
        success:false,
        message:"restaurant has been deleted",
        result:{}
      })
    }
    if(restaurant.status === "Block"){
      return res.send({
        statusCode:400,
        succes:false,
        message:"Inactive restaurant",
        result:{}
      })
    }
    if(restaurant.status === "Pending"){
      return res.send({
        statusCode:400,
        succes:false,
        message:"Inactive pending restaurant",
        result:{}
      })
    }
    
    const createNewReview = new Review({
      userId: token._id,
      userEmail:user.email,
      userName:user.fullName,
      rating,
      content,
      restaurantId:restaurantId,
      userprofilePhoto:user.profilePhoto,
      if (photos) {
        createNewReview.photos = photos;
      }
    });
    await createNewReview.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "review created successfully",
      result: {createNewReview},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: `${error.message} in create review API`,
      result: {},
    });
  }
};

exports.editReview = async (req, res) => {
  try {
    let token = req.token;
  
    let {reviewId} = req.params;
    let {content, rating} = req.body


    if (!rating) {
      return res.send({
        statusCode: 400,
        successs: false,
        message: "Rating required",
        result: {},
      });
    }
    if (!content) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Content required",
        result: {},
      });
    }

    const user = await User.findOne({ _id: token._id });

    if (!user) {
      return res.send({
        statusCode: 403,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status == "Delete") {
      return res.send({
        statusCode: 404,
        success: false,
        message: "user has been deleted",
        result: {},
      });
    }
    if (user.status == "Block") {
      return res.send({
        statusCode: 403,
        success: false,
        message: "user has blocked",
        result: {},
      });
    }

    const review = await Review.findOne({_id:reviewId});
    if (!review) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "review not found",
        result: {},
      });
    }
    if (review.status == "Delete") {
      return res.send({
        statusCode: 404,
        success: false,
        message: "review has been deleted",
        result: {},
      });
    }

    review.rating = rating;
    review.content = content;

    await review.save();

    return res.send({
      statusCode: 200,
      success: true,
      message: "review edit successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in edit review API",
      result: {},
    });
  }
};

exports.getallreviewbyuser = async (req, res) => {
  try {
    let token = req.token;
    let userId = token._id;
    // let { page = 1, limit = 10 } = req.query; 
    // page = Number.parseInt(page)
    // limit =Number.parseInt(limit) 
    // let skip = (page - 1)*limit
    let {restaurantId} = req.params;

    if (!restaurantId) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "restaurantId required",
        result: {},
      });
    }
    let user = await User.findOne({ _id: userId });

    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status == "Delete") {
      return res.send({
        statusCode: 404,
        success: false,
        message: "user has been deleted",
        result: {},
      });
    }
    const review = await Review.find({ restaurantId:restaurantId });
    if (!review) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "review not found",
        result: {},
      });
    }
    if (review.status === "Delete") {
      return res.send({
        statusCode: 404,
        success: false,
        message: "review has been deleted",
        result: {},
      });
    }
    const countReview = await Review.countDocuments({restaurantId:restaurantId, status:"Active"})
      return res.send({
        statusCode: 200,
        success: true,
        message: "review find successfully",
        result: { review, countReview },
      });
    
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get review API",
      result: {},
    });
  }
};
exports.deleteReview = async (req,res) => {
try {
    let token = req.token;
    let userId = token._id;
    let {reviewId} = req.params
    if(!userId){
        return res.send({
            statusCode:400,
            success:false,
            message:"Required userId",
            result:{}
        })
    } if(!reviewId){
        return res.send({
            statusCode:400,
            success:false,
            message:"Required reviewId",
            result:{}
        })
    }

    const user = await User.findOne({_id:userId})
    if(!user){
        return res.send({
            statusCode:404,
            success:false,
            message:"user not found",
            result:{}

        })
    }
    if(user.status=="Delete"){
        return res.send({
            statusCode:404,
            success:false,
            message:"user has deleted",
            result:{}
        })
    }

    const review = await Review.findOne({_id:reviewId});
    if(!review){
        return res.send({
            statusCode:404,
            success:false,
            message:"review not found",
            result:{}

        })
    }
    if(review.status=="Delete"){
        return res.send({
            statusCode:404,
            success:false,
            message:"review already deleted",
            result:{}
        })
    }

    review.status = "Delete"

    await review.save()

    return res.send({
        statusCode:200,
        success:true,
        message:"review deleted successfully",
        result:{review}
    })
    
    
} catch (error) {
    return res.send({
        statusCode:500,
        success:false,
        message:error.message + " ERROR in deleted review API",
        result:{}
    })
}
}

// exports.getAllReviewbyUser = async (req, res) => {
//   try {
//     let token = req.token;
//     let { page = 1, limit = 10 } = req.query;
//     page = Number.parseInt(page);
//     limit = Number.parseInt(limit);
//     const skip = (page - 1) * limit;

//     // const admin = await Admin.findOne({ _id: token._id, status: "Active" });
//     // if (!admin) {
//     //   return res.send({
//     //     statusCode: 404,
//     //     success: false,
//     //     message: "Unauthorized access",
//     //     result: {},
//     //   });
//     // }
//     const user = await User.findOne({ _id: token._id, status: "Active" });
//     if (!user) {
//       return res.send({
//         statusCode: 404,
//         success: false,
//         message: "Unauthorized access",
//         result: {},
//       });
//     }
//     const allReview = await Review.find({ status: "Active" }).skip(skip).limit(limit);

//     const totalReview = await Review.countDocuments({ status: "Active" });

//     return res.send({
//       statusCode: 200,
//       success: true,
//       message: "All Review get successfully",
//       result: {
//         Review: allReview,
//         currentPage: page,
//         totalPage: Math.ceil(totalReview / limit),
//         totalRecord: totalReview,
//       },
//     });
//   } catch (error) {
//     console.log("Error!!", error);
//     return res.send({
//       statusCode: 500,
//       success: false,
//       message: error.message || "Internal seerver error",
//       result: error,
//     });
//   }
// };

exports.getAllReviewbyAdmin = async (req, res) => {
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
    const allReview = await Review.find().skip(skip).limit(limit);
    const totalReview = await Review.countDocuments();
    return res.send({
      statusCode: 200,
      success: true,
      message: "All Review get successfully",
      result: {
        Review: allReview,
        currentPage: page,
        totalPage: Math.ceil(totalReview / limit),
        totalRecord: totalReview,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in get all review by admin",
      result: error,
    });
  }
};

exports.getreviewbyAdmin = async (req, res) => {
  try {
    let token = req.token;
    let {reviewId} = req.params
    let admin = await Admin.findOne({ _id: token._id, status: "Active" });
    if (!admin) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "admin not found",
        result: {},
      });
    }
    const review = await Review.findOne( {_id: reviewId});
    if (!review) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "review not found",
        result: {},
      });
    }
    // if (review.status == "Delete") {
    //   return res.send({
    //     statusCode: 404,
    //     success: false,
    //     message: "review has been deleted",
    //     result: {},
    //   });
    // }
    if (review) {
      return res.send({
        statusCode: 200,
        success: true,
        message: "review find successfully",
        result: { review },
      });
    }
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get review API",
      result: {},
    });
  }
};
exports.getAllReviewbyRestaurant = async (req, res) => {
  try {
    let token = req.token;
    let { page = 1, limit = 10 } = req.query;
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    const skip = (page - 1) * limit;
    const restaurant = await Restaurant.findOne({ _id: token._id, status: "Active" });
    // if (!admin) {
    //   return res.send({
    //     statusCode: 404,
    //     success: false,
    //     message: "Unauthorized access",
    //     result: {},
    //   });
    // }
    // const user = await User.findOne({ _id: token._id, status: "Active" });
    if (!restaurant) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "Unauthorized access",
        result: {},
      });
    }
    const allReview = await Review.find({restaurantId:token._id}).skip(skip).limit(limit)
    // .populate('user','fullName profilePhoto')
    // .sort({ createdAt: -1 }) // optional: latest first
    // .lean();;
    const totalReview = await Review.countDocuments({restaurantId:token._id});
    return res.send({
      statusCode: 200,
      success: true,
      message: "All Review get successfully",
      result: {
        Review: allReview,
        currentPage: page,
        totalPage: Math.ceil(totalReview / limit),
        totalRecord: totalReview,
      },
    });
  } catch (error) {
    console.log("Error!!", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + "ERROR in get all review by restaurant",
      result: error,
    });
  }
};

exports.updateRestaurantstatus = async(req,res) => {
  try {
    let token = req.token;
    let status = req.body;
    let {reviewId} = req.params;

    if(!status){
      return res.send({
        statusCode:400,
        success:false,
        message:"status is required",
        result:{}
      })
    }
    const restaurant = await Restaurant.findOne({_id:token._id, status:"Active"})
    if(!restaurant){
      return res.send({
        statusCode:404,
        success:false,
        message:"restaurant not found",
        result:{}
      })
    }

    const review = await Review.findOne({_id:reviewId, status:"Pending"})
    if(!review){
      return res.send({
        statusCode:404,
        success:false,
        message:"review not found",
        result:{}
      })
    }
    if(review.status === "Active"){
      return res.send({
        statusCode:400,
        success:false,
        message:"Review already published",
        result:{}
      })
    }
    if(review.status === "Delete"){
      return res.send({
        statusCode:400,
        success:false,
        message:"review has been deleted",
        result:{review}
      })
    }
    review.status = "Active";
    review.save()
    return res.send({
      statusCode:200,
      success:false,
      message:"review published successfully",
      result:{review}
    })
  } catch (error) {
    return res.send({
      statusCode:500,
      success:false,
      message:error.message + " ERROR in update restaurant status",
      result:{}
    })
  }
}


exports.getreviewaverages = async (req, res) => {
  try {
    let token = req.token;
    let { restaurantId } = req.params;

    if(!restaurantId){
      return res.send({
        statusCode:400,
        success:false,
        message:"RestaurantId required",
        result:{}
      })
    }

    const totalReviews = await Review.countDocuments({ restaurantId });

    const ratings = await Review.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);
    

    let ratingMap = {
      5: 0, // Excellent
      4: 0, // Very Good
      3: 0, // Average
      2: 0, // Poor
      1: 0  // Terrible
    };

    ratings.forEach(r => {
      ratingMap[r._id] = r.count;
    });

    const averageRating = await Review.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]);

    res.send({
      statusCode:200,
      success:true,
      message:"Review average fetch successfully",
      result:
      {averageRating: (averageRating[0]?.avg || 0).toFixed(1),
      totalReviews,
      breakdown: {
        Excellent: { count: ratingMap[5], percent: ((ratingMap[5] / totalReviews) * 100).toFixed(0) },
        VeryGood:  { count: ratingMap[4], percent: ((ratingMap[4] / totalReviews) * 100).toFixed(0) },
        Average:   { count: ratingMap[3], percent: ((ratingMap[3] / totalReviews) * 100).toFixed(0) },
        Poor:      { count: ratingMap[2], percent: ((ratingMap[2] / totalReviews) * 100).toFixed(0) },
        Terrible:  { count: ratingMap[1], percent: ((ratingMap[1] / totalReviews) * 100).toFixed(0) },
      }
    }
    });

  } catch (error) {
    return res.send({
      statusCode:500,
      success:false,
      message:error.message + " ERROR in get review average api",
      result:{}
    })
  }
}



// exports.getReviewAverage = async (req,res) => {
//   try {
//     let token = req.token;
//     let {restaurantId} =req.params;
//     if(!restaurantId){
//       return res.send({
//         statusCode:400,
//         success:false,
//         message:"restaurantId",
//         result:{}
//       })
//     }

//     const totalReview = await Review.Count({restaurantId,status:"Active"})

//     const ratng = await Review.aggregate([{
//    $match :{restaurantId:new mongoose.Types.ObjectId(restaurantId)},
//    $group: {
//     _id: '$rating',
//     count: { $sum: 1 }
//   }
//     }])
//   } catch (error) {
    
//   }
// }