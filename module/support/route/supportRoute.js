const express = require("express");

const route = express.Router()

const supportController = require("../../support/controller/supportController")
const upload = require("../../../middlewares/multer")
const {verifyJWT} =require("../../../middlewares/jwt")

route.post("/create-support-byUser",upload.none(),verifyJWT,supportController.createSupportbyUser)
route.post("/create-support-byRestaurant",upload.none(),verifyJWT,supportController.createSupportbyRestaurant)
route.get("/get-support-byAdmin",upload.none(),verifyJWT,supportController.getsupportbyAdmin)
route.get("/get-support-byUser",upload.none(),verifyJWT,supportController.getsupportbyUser)
route.get("/get-support-byRestaurant",upload.none(),verifyJWT,supportController.getsupportbyRestaurant)
route.post("/update-support-byAdmin/:_id",upload.none(),verifyJWT,supportController.updateSupportbyadmin)


module.exports = route;