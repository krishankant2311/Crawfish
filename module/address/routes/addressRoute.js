const express = require('express')

const route = express.Router()
const upload = require("../../../middlewares/multer")

const {verifyJWT} = require("../../../middlewares/jwt")
const addressController = require("../../address/controller/addressController")

route.post("/create-address",upload.none(),verifyJWT,addressController.createCompleteAddress)
route.post("/edit-address/:AddressId",upload.none(),verifyJWT,addressController.editAdress)
route.post("/delete-address/:AddressId",upload.none(),verifyJWT,addressController.deleteAddress)
route.get("/getall-address",verifyJWT,upload.none(),addressController.getAllAddress)
route.get("/getall-address-byUser",verifyJWT,upload.none(),addressController.getAllAddressbyUser)
module.exports = route;