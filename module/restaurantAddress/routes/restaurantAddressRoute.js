const express = require('express')

const route = express.Router()
const upload = require("../../../middlewares/multer")

const {verifyJWT} = require("../../../middlewares/jwt")
const RestaurantAddressController = require("../../restaurantAddress/controller/restaurantAddressController")

route.post("/create-address",verifyJWT,upload.none(),RestaurantAddressController.createCompleteAddress)
route.post("/edit-address/:AddressId",verifyJWT,upload.none(),RestaurantAddressController.editAdress)
route.post("/delete-address/:AddressId",verifyJWT,upload.none(),RestaurantAddressController.deleteAddress)
route.get("/getall-address",verifyJWT,upload.none(),RestaurantAddressController.getAllAddressByAdmin)
route.get("/getall-address-byRestaurant",verifyJWT,upload.none(),RestaurantAddressController.getAllAddressbyRestaurant)
route.get("/getall-address-byUser/:restaurantId/:AddressId",verifyJWT,upload.none(),RestaurantAddressController.getRestaurantAddressByUser)
module.exports = route;