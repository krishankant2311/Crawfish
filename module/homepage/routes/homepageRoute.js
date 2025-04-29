const express = require("express");

const route = express.Router()

// const verifyJWT = require("../../../middlewares/jwt")
const {homepageData,getFilteredRestaurants,topRatedData,nearMeData} = require("../../homepage/Controller/homepageController")
const {verifyJWT} = require("../../../middlewares/jwt");
const upload = require("../../../middlewares/multer");


route.get('/homepage-data', upload.none() , homepageData)
route.get('/top-rated-restaurant', upload.none() , topRatedData)
// route.get('/top-rated-restaurant', upload.none() , nearMeData)
route.get('/get-filtered-restaurants', upload.none() , getFilteredRestaurants)
module.exports = route;
