const express = require('express')

const route = express.Router()
const upload = require("../../../middlewares/multer")

const {verifyJWT} = require("../../../middlewares/jwt")
const filterController = require("../../filter/controller/filterController")

route.post("/filtered-restaurants",verifyJWT,upload.none(),filterController.filteredRestaurant)
route.post("/restaurants",verifyJWT,upload.none(),filterController.getfilterRestaurant)

module.exports = route