const Filter = require("../../filter/model/filterModel");
// const Dummy = require("../../../../dummy");
const Admin = require("../../admin/model/adminModel");
const User = require("../../user/model/userModel");

const Restaurant = [
  {
    restaurant_id: "1",
    name: "Tasty Bites",
    location: {
      latitude: 28.7041,
      longitude: 77.1025,
    },
    distance: 2.3,
    rating: 4.5,
    verified: true,
    address: "123 Main Street, Delhi",
    opening_hours: "10:00 AM - 10:00 PM",
  },
  {
    restaurant_id: "2",
    name: "Pizza Haven",
    location: {
      latitude: 28.7055,
      longitude: 77.104,
    },
    distance: 1.2,
    rating: 4.2,
    verified: false,
    address: "456 Elm Road, Delhi",
    opening_hours: "11:00 AM - 11:00 PM",
  },
  {
    restaurant_id: "3",
    name: "Sushi Master",
    location: {
      latitude: 28.707,
      longitude: 77.106,
    },
    distance: 3.8,
    rating: 4.8,
    verified: true,
    address: "789 Oak Avenue, Delhi",
    opening_hours: "12:00 PM - 10:30 PM",
  },
  {
    restaurant_id: "4",
    name: "Burger Planet",
    location: {
      latitude: 28.71,
      longitude: 77.11,
    },
    distance: 5.0,
    rating: 3.9,
    verified: true,
    address: "101 Pine Street, Delhi",
    opening_hours: "9:00 AM - 11:00 PM",
  },
  {
    restaurant_id: "5",
    name: "Vegan Delights",
    location: {
      latitude: 28.7025,
      longitude: 77.105,
    },
    distance: 4.5,
    rating: 4.7,
    verified: true,
    address: "202 Maple Road, Delhi",
    opening_hours: "8:00 AM - 9:00 PM",
  },
  {
    restaurant_id: "6",
    name: "Curry Corner",
    location: {
      latitude: 28.7032,
      longitude: 77.1085,
    },
    distance: 2.1,
    rating: 4.1,
    verified: false,
    address: "303 Cedar Lane, Delhi",
    opening_hours: "10:00 AM - 11:00 PM",
  },
  {
    restaurant_id: "7",
    name: "Spice Villa",
    location: {
      latitude: 28.708,
      longitude: 77.112,
    },
    distance: 6.2,
    rating: 4.3,
    verified: true,
    address: "404 Birch Avenue, Delhi",
    opening_hours: "11:00 AM - 10:00 PM",
  },
  {
    restaurant_id: "8",
    name: "Taco Town",
    location: {
      latitude: 28.7095,
      longitude: 77.114,
    },
    distance: 3.0,
    rating: 3.7,
    verified: false,
    address: "505 Ash Street, Delhi",
    opening_hours: "9:30 AM - 10:30 PM",
  },
  {
    restaurant_id: "9",
    name: "The Diner",
    location: {
      latitude: 28.7105,
      longitude: 77.1155,
    },
    distance: 2.7,
    rating: 4.0,
    verified: true,
    address: "606 Redwood Drive, Delhi",
    opening_hours: "9:00 AM - 11:00 PM",
  },
  {
    restaurant_id: "10",
    name: "Bakery Bliss",
    location: {
      latitude: 28.711,
      longitude: 77.117,
    },
    distance: 4.0,
    rating: 4.6,
    verified: true,
    address: "707 Willow Street, Delhi",
    opening_hours: "7:00 AM - 8:00 PM",
  },
];

// exports.filteredRestaurant = async (req, res) => {
//   try {
//     let token = req.token;

//     const user = await User.findOne({ _id: token._id });
//     if (!user) {
//       return res.send({
//         statusCode: 400,
//         success: false,
//         message: "user not found",
//         result: {},
//       });
//     }
//     if (user.status === "Delete") {
//       return res.send({
//         statusCode: 401,
//         success: false,
//         message: "user has beeen deleted",
//         result: {},
//       });
//     }
//     if (user.status === "Block" || user.status === "Pending") {
//       return res.send({
//         statusCode: 400,
//         success: false,
//         message: "Inactive user",
//         result: {},
//       });
//     }
//     let { verified, distance, rating } = req.body;

//     let filteredRestaurants = Restaurant;
//     if (!filteredRestaurants.length) {
//       return res.send({
//         statusCode: 404,
//         success: false,
//         message: "no restaurant found",
//         result: {},
//       });
//     }
//     // if (filteredRestaurants.status === "Delete") {
//     //   return res.send({
//     //     statusCode: 401,
//     //     success: false,
//     //     message: "filtered restaurant has been deleted",
//     //     result: {},
//     //   });
//     // }
//     // if (
//     //   filteredRestaurants.status === "Pending" ||
//     //   filteredRestaurants.status === "Block"
//     // ) {
//     //   return res.send({
//     //     statusCode: 401,
//     //     success: false,
//     //     message: "Inactive restaurant",
//     //     result: {},
//     //   });
//     // }

//     if (distance) {
//       distance = parseInt(distance);
//       filteredRestaurants = filteredRestaurants.filter(
//         (r) => r.distance <= distance
//       );
//     }

//     if (rating) {
//       rating = parseFloat(rating);
//       filteredRestaurants = filteredRestaurants.filter(
//         (r) => r.rating >= rating
//       );
//     }

//     if (verified !== undefined) {
//         verified = verified === true || verified === "true";
//         filteredRestaurants = filteredRestaurants.filter(r => r.verified === verified);
//       }
//     let filter = await Filter.findOne();
//     if (filter) {
//       filter.distance = filteredRestaurants.distance;
//       filter.rating = filteredRestaurants.rating;
//       filter.verified = filteredRestaurants.verified;
//       await filter.save();
//       return res.send({
//         statuscode: 200,
//         success: false,
//         message: "filtered restaurant fetch successfully",
//         result: { filteredRestaurants },
//       });
//     }
//   } catch (error) {
//     return res.send({
//       statusCode: 500,
//       success: false,
//       message: error.message + " ERROR in filtered restaurant api",
//       result: { error },
//     });
//   }
// };
exports.filteredRestaurant = async (req, res) => {
  try {
    const token = req.token;
    const user = await User.findById(token._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.status === "Delete") {
      return res.status(401).json({
        success: false,
        message: "User has been deleted",
      });
    }

    if (user.status === "Block" || user.status === "Pending") {
      return res.status(400).json({ 
        success: false,
        message: "Inactive user",
      });
    }

    let { verified, distance, rating } = req.body;
    let filteredRestaurants = [...Restaurant];

    if (distance) {
      distance = parseInt(distance);
      filteredRestaurants = filteredRestaurants.filter(
        (r) => r.distance <= distance
      );
    }

    if (rating) {
      rating = parseFloat(rating);
      filteredRestaurants = filteredRestaurants.filter(
        (r) => r.rating >= rating
      );
    }

    if (verified !== undefined) {
      verified = verified === true || verified === "true";
      filteredRestaurants = filteredRestaurants.filter(
        (r) => r.verified === verified
      );
    }

    let filter = await Filter.findOne({verified:verified,distance:distance,rating:rating});
    if (!filter) {
      filter = new Filter(
      distance,
      rating,
      verified,
    await filter.save()
      );
    }

    filter.distance = distance || filter.distance;
    filter.rating = rating || filter.rating;
    filter.verified = verified !== undefined ? verified : filter.verified;
    await filter.save();

    return res.status(200).json({
      success: true,
      message: "Filtered restaurants fetched successfully",
      result: filteredRestaurants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in filtered restaurant API: " + error.message,
      error,
    });
  }
};

exports.getfilterRestaurant = async (req, res) => {
  try {
    let token = req.token;
    let {id} = req.params;

    const user = await User.findOne({ _id: token._id });
    if (!user) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "user not found",
        result: {},
      });
    }
    if (user.status === "Delete") {
      return res.send({
        statusCode: 401,
        success: false,
        message: "user has beeen deleted",
        result: {},
      });
    }
    if (user.status === "Block" || user.status === "Pending") {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Inactive user",
        result: {},
      });
    }
    const restaurant = Restaurant.find((r) => r.id === id);
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get filter api",
      result: {},
    });
  }
};
