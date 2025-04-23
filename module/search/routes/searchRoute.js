const express = require("express");

const route = express.Router()

const upload = require("../../../middlewares/multer")
const {verifyJWT} =require("../../../middlewares/jwt")
const searchController = require("../../../module/search/controller/searchController")

route.get("/search-restaurant/",verifyJWT,upload.none(), searchController.searchRestaurant)
route.post("/recent-search",verifyJWT,upload.none(),searchController.saveRecentSearch)
route.get("/getrecent-search",verifyJWT,searchController.getRecentSearches)
route.get("/delete-search/:searchId",verifyJWT,searchController.deletesearch)

module.exports = route;