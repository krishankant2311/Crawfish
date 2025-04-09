const express = require("express");

const route = express.Router()

// const verifyJWT = require("../../../middlewares/jwt")
const {homepage,getNearbyRestaurants,homepageData} = require("../../homepage/Controller/homepageController")

const {verifyJWT} = require("../../../middlewares/jwt")

route.get("/homepage-details",verifyJWT, homepage)
route.get("/get-nearby-restaurant", getNearbyRestaurants)
route.get('/homepage-data',homepageData)

module.exports = route;
