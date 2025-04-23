const User = require("../../user/model/userModel");

const Restaurant = require("../../restaurants/model/restaurantModel");

const Admin = require("../../admin/model/adminModel");
const Search = require("../../search/model/searchModel");

exports.searchRestaurant = async (req, res) => {
  try {
    let token = req.token;
    let query = req.query.query || "";

    let searchQuery = {};
    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "User not found",
        result: {},
      });
    }
    if (user.status === "Delete") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "User has been deleted",
        result: {},
      });
    }
    if (user.status === "Block" || user.status === "Pending") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Unauthorise acccess or Inactive user",
        result: {},
      });
    }
    if (query) {
      searchQuery.restaurantName = { $regex: query, $options: "i" };
    }
    const restaurant = await Restaurant.find(searchQuery).select("-token -securityToken -otp -password -phoneNumber")
      .limit(10)
      .sort({ name: 1 });
    if (restaurant.length === 0) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "result not found",
        result: {},
      });
    }

    // const search = new Search({
    //   query:query,
    //   userId : token._id,
    // })

    // await search.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "restaurant search successfully",
      result: { restaurant },
    });
  } catch (error) {
    console.error("Error in searchRestaurant API:", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in search restaurant api",
      result: {},
    });
  }
};
exports.getRecentSearches = async (req, res) => {
  try {
    let token = req.token;

    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "User not found",
        result: {},
      });
    }
    if (user.status === "Delete") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "User has been deleted",
        result: {},
      });
    }
    if (user.status === "Block" || user.status === "Pending") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Unauthorise acccess or Inactive user",
        result: {},
      });
    }

    const recentSearches = await Search.findOne({ userId:token._id })
      .sort({ createdAt: -1 })
      .limit(10);


if(!recentSearches){
  return res.send({
    statudsCode:404,
    success:false,
    message:"recent search not found",
    result:{}
  })
}
    return res.send({
      statusCode: 200,
      success: true,
      message: "Recent searches fetched successfully",
      result: { recentSearches },
    });
  } catch (error) {
    console.error("Error in getRecentSearches API:", error);
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " - ERROR in get recent searches API",
      result: {},
    });
  }
};
exports.saveRecentSearch = async (req, res) => {
  try {
    let token = req.token;
    let query = req.body.query;
    // console.log("query", query);

    if (!query) {
      return res.send(400)({
        statusCode: 400,
        success: false,
        message: "User search query is missing",
        result: {},
      });
    }

    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "User not found",
        result: {},
      });
    }
    if (user.status === "Delete") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "User has been deleted",
        result: {},
      });
    }
    if (user.status === "Block" || user.status === "Pending") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "Unauthorise acccess or Inactive user",
        result: {},
      });
    }

    const search = await Search.findOneAndUpdate(
      { userId: token._id, query: query },
      { userId: token._id, query: query, createdAt: new Date(), status:"Active" },
      { upsert: true, new: true }
    );
    if(!search){
      const createsearch = new Search({
         query:query,
         userId:token._id
        })
         await createsearch.save()
        return res.send({
          statusCode:200,
          success:true,
          message:"recent search save successfully",
          result:{createsearch}
        })
    }

    return res.send({
      statusCode: 200,
      success: true,
      message: "Recent search saved successfully",
      result:{search}
    });
  } catch (error) {
    console.error("Error in saveRecentSearch API:", error);
    return res.status({
      statusCode: 500,
      success: false,
      message: error.message + " - ERROR in save recent search API",
    });
  }
};
exports.deletesearch = async (req, res) => {
  try {
    let token = req.token;
    let { searchId } = req.params;
    if (!searchId) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "searchId is required",
        result: {},
      });
    }

    const user = await User.findOne({ _id: token._id, status: "Active" });
    const admin = await Admin.findOne({ _id: token._id, status: "Active" });
    if (!(user || admin)) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "User not found",
        result: {},
      });
    }

    const search = await Search.findOne({ _id: searchId });
    if (!search) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "search not found",
        result: {},
      });
    }
    if (search.status === "Delete") {
      return res.send({
        statusCode: 400,
        success:false,
        message: "Search has been already deleted",
        result: {},
      });
    }
    search.status = "Delete";
    await search.save();
    return res.send({
      statusCode: 200,
      success: true,
      message: "Search Deleted successfully",
      result: {},
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in delete search API",
      result: {},
    });
  }
};
