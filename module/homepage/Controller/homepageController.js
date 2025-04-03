const User = require("../../user/model/userModel");
const Restaurant = require("../../restaurants/model/restaurantModel");
const Address = require("../../../module/address/model/addressModel");
const Favourite = require("../../favourite/model/favouritemodel");
const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

exports.homepage = async (req, res) => {
  try {
    let token = req.token;
    let { userId ,addressId } = req.params;
    // if (userId) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "user id required",
    //     result: {},
    //   });
    // }
    // if (!addressId) {
    //   return res.send({
    //     statusCode: 400,
    //     success: false,
    //     message: "required address id ",
    //     result: {},
    //   });
    // }
    const user = await User.findOne({ _id: token._id, status: "Active" }).select(
      "userlocation profilePhoto"
    );
    if (!user) {
      return res.send({
        statusCode: 404,
        success: false,
        message: "User not found",
        result: {},
      });
    }

    // const address = await Address.findOne({ _id:addressId ,userId, status: "Active" });
    // if (!address) {
    //   return res.send({
    //     statusCode: 404,
    //     success: false,
    //     message: "Address not found",
    //     result: {},
    //   });
    // }

    // Fetch Featured Restaurants
    const featuredRestaurant = await Restaurant.find({ status: "Active" })
      .limit(5)
      .select("location restaurantName rating");

    // Fetch Top Rated Restaurants
    const topRatedRestaurant = await Restaurant.find({ status: "Active" })
      .sort({ rating: -1 })
      .limit(4)
      .select("restaurantName rating restaurantLogo");

    // Fetch Near Me Restaurants using Web Scraping
    // const nearMeRestaurants = await scrapNearbyRestaurants(
    //   address.latitude,
    //   address.longitude
    // );

    return res.send({
      statusCode: 200,
      success: true,
      message: "Data fetched successfully",
      result: {
        user,
        featuredRestaurant,
        topRatedRestaurant,
        // nearMeRestaurants,
        // address,
      },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in homepage API",
      result: error.message,
    });
  }
};

// const scrapNearbyRestaurants = async (lat, lng) => {
//   try {
//     const searchQuery = `restaurants near ${lat},${lng}`;
//     const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

//     const browser = await puppeteer.launch({ headless: "new", defaultViewport: null });
//     const page = await browser.newPage();
//     await page.goto(mapsUrl, { waitUntil: "networkidle2" });

//     await page.waitForSelector(".Nv2PK", { timeout: 30000 });

//     const restaurants = await page.evaluate(() => {
//       let results = [];
//       let list = document.querySelectorAll(".Nv2PK");

//       list.forEach((item, index) => {
//         let name = item.querySelector(".qBF1Pd")?.innerText.trim() || "N/A";
//         const ratingElement = item.querySelector(".ZkP5Je");
//         let rating = ratingElement ? ratingElement.innerText.trim() : "N/A";
//         let total_reviews = "N/A";
//         const reviewElement = item.querySelector(".UY7F9");
//         if (reviewElement) {
//           let match = reviewElement.innerText.match(/\(([-9,]+)\)/);
//           total_reviews = match ? match[1].replace(/,/g, "") : "N/A";
//         }

//         let price = "N/A";
//         let address = "N/A";
//         let timing = "N/A";
//         let infoElements = item.querySelectorAll(".W4Efsd");

//         infoElements.forEach((el) => {
//           let text = el.innerText.trim();
//           if (text.includes("Open") || text.includes("Closes") || text.includes("Reopens")) {
//             timing = text;
//           } else if (text.length > 10 && !text.includes("₹")) {
//             address = text;
//           }
//         });

//         results.push({ index: index + 1, name, rating, total_reviews, price, address, timing });
//       });
//       return results;
//     });

//     await browser.close();
//     return restaurants;
//   } catch (error) {
//     console.error("❌ Error scraping restaurants:", error);
//     return [];
//   }
// };
