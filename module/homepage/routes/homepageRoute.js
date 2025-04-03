const express = require("express");

const route = express.Router()

// const verifyJWT = require("../../../middlewares/jwt")
const {homepage} = require("../../homepage/Controller/homepageController")

const {verifyJWT} = require("../../../middlewares/jwt")

route.get("/homepage-details",verifyJWT, homepage)

module.exports = route;
