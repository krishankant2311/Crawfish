const User = require("../../user/model/userModel");
const Restaurant = require("../../restaurants/model/restaurantModel");
const Address = require("../../../module/address/model/addressModel");
const Favourite = require("../../favourite/model/favouritemodel");
const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const scrapeGoogleMaps = require("../../../scrapping/scrappingGoogleMap");
puppeteer.use(StealthPlugin());

// const Restaurant = require('./models/Restaurant');

// Restaurant.syncIndexes()
//   .then(() => console.log("✅ Index created"))
//   .catch((err) => console.error("❌ Index creation error:", err));


// exports.homepage = async (req, res) => {
//   try {
//     let token = req.token;
//     let { userId ,addressId } = req.params;
//     // if (userId) {
//     //   return res.send({
//     //     statusCode: 400,
//     //     success: false,
//     //     message: "user id required",
//     //     result: {},
//     //   });
//     // }
//     // if (!addressId) {
//     //   return res.send({
//     //     statusCode: 400,
//     //     success: false,
//     //     message: "required address id ",
//     //     result: {},
//     //   });
//     // }
//     const user = await User.findOne({ _id: token._id, status: "Active" }).select(
//       "userlocation profilePhoto"
//     );
//     if (!user) {
//       return res.send({
//         statusCode: 404,
//         success: false,
//         message: "User not found",
//         result: {},
//       });
//     }

//     // const address = await Address.findOne({ _id:addressId ,userId, status: "Active" });
//     // if (!address) {
//     //   return res.send({
//     //     statusCode: 404,
//     //     success: false,
//     //     message: "Address not found",
//     //     result: {},
//     //   });
//     // }

//     // Fetch Featured Restaurants
//     const featuredRestaurant = await Restaurant.find({ status: "Active" })
//       .limit(5)
//       // .select("location restaurantName rating");

//     // Fetch Top Rated Restaurants
//     const topRatedRestaurant = await Restaurant.find({ status: "Active" })
//       .sort({ rating: -1 })
//       .limit(4)
//       // .select("restaurantName rating restaurantLogo");

//     // Fetch Near Me Restaurants using Web Scraping
//     // const nearMeRestaurants = await scrapNearbyRestaurants(
//     //   address.latitude,
//     //   address.longitude
//     // );

//     return res.send({
//       statusCode: 200,
//       success: true,
//       message: "Data fetched successfully",
//       result: {
//         user,
//         featuredRestaurant,
//         topRatedRestaurant,
//         // nearMeRestaurants,
//         // address,
//       },
//     });
//   } catch (error) {
//     return res.send({
//       statusCode: 500,
//       success: false,
//       message: error.message + " ERROR in homepage API",
//       result: error.message,
//     });
//   }
// };
// exports.getNearbyRestaurants = async (req, res) => {
//   try {
//     const { lat, lng } = req.query;

//     if (!lat || !lng) {
//       return res.send({
//         statusCode:400,
//         success:false,
//          message: "Latitude and Longitude required.",
//         result:{} });
//     }

//     const latitude = parseFloat(lat);
//     const longitude = parseFloat(lng);

//     const restaurants = await Restaurant.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: [longitude, latitude]
//           },
//           distanceField: "distance",
//           spherical: true,
//           maxDistance: 5000 // 5km radius
//         }
//       },
//       {
//         $match: {
//           status: "Active"
//         }
//       },
//       {
//         $project: {
//           restaurantName: 1,
//           city: 1,
//           distance: 1,
//           rating: 1,
//           restaurantLogo: 1
//         }
//       }
//     ]);

//     res.send({
//       statusCode:200,
//       success: true,
//       message:"nearby restaurant fetch successfully",
//       count: restaurants.length,
//       result:{restaurants}
//     });

//   } catch (error) {
//     console.error("Error finding nearby restaurants:", error);

//     res.send({
//       statusCode:500,
//        message: message.error+" ERROR in get nearby restaurant api",
//       result:{}
//      });
//   }
// };


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




// const puppeteer = require('puppeteer');

// const puppeteer = require('puppeteer');

// const puppeteer = require('puppeteer');

// const scrapeRestaurants = async (latitude, longitude) => {
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });
//   const page = await browser.newPage();
//   await page.setUserAgent(
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
//   );
//   const searchUrl = `https://www.google.com/maps/search/restaurants/@${latitude},${longitude},15z`;
//   await page.goto(searchUrl, { waitUntil: 'networkidle2' });
//   // Scroll to load more
//   await autoScroll(page);
//   const restaurants = await page.evaluate(() => {
//     const data = [];
//     const cards = document.querySelectorAll('.Nv2PK'); // Each restaurant card
//     cards.forEach(card => {
//       const name = card.querySelector('.qBF1Pd')?.innerText || null;
//       const ratingText = card.querySelector('.MW4etd')?.innerText || null;
//       const rating = ratingText ? parseFloat(ratingText) : null;
//       // const address = card.querySelector('.rllt__details span')?.innerText || null;
//       const image = card.querySelector('img')?.src || null;
//       const lines = card.innerText.split('\n');
//       let address = null;
//       for (let i = 0; i < lines.length; i++) {
//         const line = lines[i];
//         // Match street/sector/market or 6-digit PIN or typical address
//         if (
//           /Street|Road|Sector|Block|Market|Nagar|Colony|Place|Chowk|Vihar/i.test(line) ||
//           /\d{6}/.test(line)
//         ) {
//           address = line;
//           break;
//         }
//       }
//       if (name) {
//         data.push({ name, rating, address, image });
//       }
//     });
//     return data;
//   });
//   await browser.close();
//   // Filter Logic
//   const filtered = restaurants.filter(r => r.rating && r.rating >= 4.0);
//   const topRated = [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 5);
//   const featured = restaurants.slice(0, 5);
//   const nearby = restaurants.slice(0, 10);
//   return { featured, topRated, nearby };
// };
// async function autoScroll(page) {
//   await page.evaluate(async () => {
//     await new Promise(resolve => {
//       let totalHeight = 0;
//       const distance = 100;
//       const timer = setInterval(() => {
//         const scrollHeight = document.body.scrollHeight;
//         window.scrollBy(0, distance);
//         totalHeight += distance;
//         if (totalHeight >= scrollHeight) {
//           clearInterval(timer);
//           resolve();
//         }
//       }, 200);
//     });
//   });
// }




// const puppeteer = require('puppeteer');

// const puppeteer = require('puppeteer');

// const scrapeRestaurants = async (latitude, longitude) => {
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });

//   const page = await browser.newPage();
//   await page.setUserAgent(
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
//   );

//   const searchUrl = `https://www.google.com/maps/search/restaurants/@${latitude},${longitude},15z`;
//   await page.goto(searchUrl, { waitUntil: 'networkidle2' });

//   await autoScroll(page);

//   // Manual delay instead of page.waitForTimeout
//   await new Promise(resolve => setTimeout(resolve, 2000));

//   const restaurants = await page.evaluate(() => {
//     const data = [];
//     const cards = document.querySelectorAll('.Nv2PK');
//     cards.forEach(card => {
//       const name = card.querySelector('.qBF1Pd')?.innerText || null;
//       const ratingText = card.querySelector('.MW4etd')?.innerText || null;
//       const rating = ratingText ? parseFloat(ratingText) : null;
//       const image = card.querySelector('img')?.src || null;

//       const lines = card.innerText.split('\n');
//       let address = null;
//       for (let i = 0; i < lines.length; i++) {
//         const line = lines[i];
//         if (
//           /Street|Road|Sector|Block|Market|Nagar|Colony|Place|Chowk|Vihar/i.test(line) ||
//           /\d{6}/.test(line)
//         ) {
//           address = line;
//           break;
//         }
//       }

//       if (name) {
//         data.push({ name, rating, address, image });
//       }
//     });
//     return data;
//   });

//   await browser.close();

//   const featured = restaurants.slice(0, 5);
//   const topRated = [...restaurants]
//     .filter(r => r.rating)
//     .sort((a, b) => b.rating - a.rating)
//     .slice(0, 5);
//   const nearby = restaurants.slice(0, 10);

//   return { featured, topRated, nearby };
// };

// async function autoScroll(page) {
//   await page.evaluate(async () => {
//     await new Promise(resolve => {
//       let totalHeight = 0;
//       const distance = 300;
//       const timer = setInterval(() => {
//         window.scrollBy(0, distance);
//         totalHeight += distance;
//         if (totalHeight >= 3000) {
//           clearInterval(timer);
//           resolve();
//         }
//       }, 200);
//     });
//   });
// }






// module.exports = scrapeRestaurants;


// 👇 Example call (can be API call too)
// // scrapeRestaurants(latitude, longitude)
//   .then(data => console.log(JSON.stringify(data, null, 2)))
//   .catch(err => console.error('Scrape error:', err));





//   const express = require('express');
// const app = express();
// const port = 3000;

// exports.homepageData =  async (req, res) => {
//   const { lat, lng } = req.query;
//   if (!lat || !lng) return res.status(400).send({ message: 'Latitude and longitude required' });

//   try {
//     const data = await scrapeRestaurants(lat, lng);
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: 'Failed to scrape restaurants' });
//   }
// }









// exports.homepageData = async (req, res) => {
//   try {
//     let { lat, lng, address, maxDistance = 5, rating = 1 } = req.query;
//     maxDistance = Number.parseFloat(maxDistance) * 1000;
//     rating = Number.parseFloat(rating);
//     if (!lat || !lng) {
//       return res.send({
//         statusCode: 400,
//         success: false,
//         message: "Latitude and Longitude are mandatory",
//         result: {},
//       });
//     }
//     if (!address) {
//       return res.send({
//         statusCode: 400,
//         success: false,
//         message: "Address is mandatory",
//         result: {},
//       });
//     }
//     // Check the count of restaurants for the location
//     const counts = await Restaurant.countDocuments({
//       "location.coordinates": [lng, lat],
//       // status: "Active"
//     });
//     // Lock to prevent multiple scrapes for the same lat/lng
//     if (counts > 5) {
//       // Start scraping in the background, but don't block API response
//       scrapeGoogleMaps(lat, lng, address);
//     } else {
//       await scrapeGoogleMaps(lat, lng, address);
//     }
//     // Fetch restaurant data concurrently
//     const [featuredRestaurant, topRatedRestaurants, nearByRestaurants] =
//       await Promise.all([
//         Restaurant.find({
//           "location.coordinates": [lng, lat],
//           rating: { $gte: rating },
//           // status : "Active"
//         })
//           .limit(5)
//           .lean(),
//         Restaurant.find({
//           "location.coordinates": [lng, lat],
//           rating: { $gte: rating },
//           // status : "Active"
//         })
//           .sort({
//             rating: -1,
//           })
//           .limit(5)
//           .lean(),
//         Restaurant.aggregate([
//           {
//             $geoNear: {
//               near: {
//                 type: "Point",
//                 coordinates: [Number(lng), Number(lat)],
//               },
//               key: "location.coordinates",
//               distanceField: "dist.calculated",
//               spherical: true,
//             },
//           },
//           {
//             $addFields: {
//               "dist.calculatedInKm": { $divide: ["$dist.calculated", 1000] },
//             },
//           },
//           {
//             $match: {
//               "dist.calculatedInKm": { $lte: parseFloat(maxDistance) }, // 2000 kilometers
//             },
//           },
//           {
//             $match: {
//               rating: { $gte: rating },
//             },
//           },
//           { $limit: 5 },
//         ]),
//       ]);
//     return res.send({
//       statusCode: 200,
//       success: true,
//       message: "Data fetched successfully.",
//       result: {
//         featuredRestaurant,
//         topRatedRestaurants,
//         nearByRestaurants,
//       },
//     });
//   } catch (error) {
//     return res.send({
//       statusCode: 500,
//       success: false,
//       message: error.message || "Internal Server Error",
//       result: {},
//     });
//   }
// };
exports.getFilteredRestaurants = async (req, res) => {
  try {
    let { lat, lng, address, maxDistance = 5, rating = 1 } = req.body;
    let {page = 1, limit = 5} = req.query;
    maxDistance = Number.parseFloat(maxDistance) * 1000;
    rating = Number.parseFloat(rating);
    page = Number.parseInt(page);
    limit = Number.parseInt(limit);
    if (!lat || !lng) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Latitude and Longitude are mandatory",
        result: {},
      });
    }
    if (!address) {
      return res.send({
        statusCode: 400,
        success: false,
        message: "Address is mandatory",
        result: {},
      });
    }
    const nearbyRestaurants = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          key: "location.coordinates",
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
      {
        $addFields: {
          "dist.calculatedInKm": { $divide: ["$dist.calculated", 1000] },
        },
      },
      {
        $match: {
          "dist.calculatedInKm": { $lte: parseFloat(maxDistance) }, // maxDistance in km
        },
      },
      {
        $match: {
          rating: { $gte: rating }, // min rating filter
        },
      },
      {
        $skip: (page - 1) * limit,  // Skip documents based on page number
      },
      {
        $limit: limit,  // Limit the number of results per page
      },
    ]);
    // Count the total number of matching restaurants for pagination info
    const totalCount = await Restaurant.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
          key: "location.coordinates",
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
      {
        $addFields: {
          "dist.calculatedInKm": { $divide: ["$dist.calculated", 1000] },
        },
      },
      {
        $match: {
          "dist.calculatedInKm": { $lte: parseFloat(maxDistance) }, // maxDistance in km
        },
      },
      {
        $match: {
          rating: { $gte: rating }, // min rating filter
        },
      },
      {
        $count: "total",
      },
    ]);
    const totalResults = totalCount.length > 0 ? totalCount[0].total : 0;
    const totalPages = Math.ceil(totalResults / limit);
    return res.send({
      statusCode: 200,
      success: true,
      message: "Data fetched successfully.",
      result: {
          data : nearbyRestaurants,
          currentPage: page,
          totalPages,
          totalRecords : totalResults,
      },
    });
  } catch (error) {
    return res.send({
      statusCode: 500,
      success: false,
      message: error.message + " ERROR in get filtered api",
      result: {},
    });
  }
};

// exports.topRatedData = async (req, res) => {
//   try {
//     let { lat, lng, address, maxDistance = 5, rating = 1 } = req.body;

//     maxDistance = Number.parseFloat(maxDistance) * 1000;
//     rating = Number.parseFloat(rating);

//     if (!lat || !lng) {
//       return res.send({
//         statusCode: 400,
//         success: false,
//         message: "Latitude and Longitude are mandatory",
//         result: {},
//       });
//     }

//     if (!address) {
//       return res.send({
//         statusCode: 400,
//         success: false,
//         message: "Address is mandatory",
//         result: {},
//       });
//     }

//     const counts = await Restaurant.countDocuments({
//       "location.coordinates": [lng, lat],
//       // status: "Active"
//     });

//     // Scraping logic
//     if (counts > 5) {
//       scrapeGoogleMaps(lat, lng, address); // non-blocking
//     } else {
//       await scrapeGoogleMaps(lat, lng, address); // wait for scrape
//     }

//     // Fetch top-rated restaurants only
//     const topRatedRestaurants = await Restaurant.find({
//       "location.coordinates": [lng, lat],
//       rating: { $gte: rating },
//       // status: "Active"
//     })
//       .sort({ rating: -1 })
//       .limit(10)
//       .lean();

//     return res.send({
//       statusCode: 200,
//       success: true,
//       message: "Top rated restaurants fetched successfully.",
//       result: {
//         topRatedRestaurants,
//       },
//     });
//   } catch (error) {
//     return res.send({
//       statusCode: 500,
//       success: false,
//       message: error.message || "Internal Server Error",
//       result: {},
//     });
//   }
// };

// exports.nearMeData = async (req, res) => {
//   try {
//     let { lat, lng, address, maxDistance = 5, rating = 1 } = req.body;

//     maxDistance = Number.parseFloat(maxDistance) * 1000; // km to meters
//     rating = Number.parseFloat(rating);

//     if (!lat || !lng) {
//       return res.send({
//         statusCode: 400,
//         success: false,
//         message: "Latitude and Longitude are mandatory",
//         result: {},
//       });
//     }

//     if (!address) {
//       return res.send({
//         statusCode: 400,
//         success: false,
//         message: "Address is mandatory",
//         result: {},
//       });
//     }

//     const counts = await Restaurant.countDocuments({
//       "location.coordinates": [lng, lat],
//       // status: "Active"
//     });

//     // Scraping logic
//     if (counts > 5) {
//       scrapeGoogleMaps(lat, lng, address); // background
//     } else {
//       await scrapeGoogleMaps(lat, lng, address); // wait
//     }

//     // Fetch nearby restaurants
//     const nearByRestaurants = await Restaurant.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: "Point",
//             coordinates: [Number(lng), Number(lat)],
//           },
//           key: "location.coordinates",
//           distanceField: "dist.calculated",
//           spherical: true,
//         },
//       },
//       {
//         $addFields: {
//           "dist.calculatedInKm": { $divide: ["$dist.calculated", 1000] },
//         },
//       },
//       {
//         $match: {
//           "dist.calculatedInKm": { $lte: parseFloat(maxDistance) },
//           rating: { $gte: rating },
//         },
//       },
//       {
//         $limit: 10,
//       },
//     ]);

//     return res.send({
//       statusCode: 200,
//       success: true,
//       message: "Nearby restaurants fetched successfully.",
//       result: {
//         nearByRestaurants,
//       },
//     });
//   } catch (error) {
//     return res.send({
//       statusCode: 500,
//       success: false,
//       message: error.message || "Internal Server Error",
//       result: {},
//     });
//   }
// };
