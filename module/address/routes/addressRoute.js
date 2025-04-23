const express = require('express')

const route = express.Router()
const upload = require("../../../middlewares/multer")

const {verifyJWT} = require("../../../middlewares/jwt")
const addressController = require("../../address/controller/addressController")

route.post("/create-address",verifyJWT,upload.none(),addressController.createCompleteAddress)
route.post("/edit-address/:AddressId",verifyJWT,upload.none(),addressController.editAdress)
route.post("/delete-address/:AddressId",verifyJWT,upload.none(),addressController.deleteAddress)
route.get("/getall-address",verifyJWT,upload.none(),addressController.getAllAddress)
route.get("/getall-address-byUser",verifyJWT,upload.none(),addressController.getAllAddressbyUser)
module.exports = route;