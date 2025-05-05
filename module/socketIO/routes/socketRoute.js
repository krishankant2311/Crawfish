const express = require("express");
// const Message = require("../../socketIO/model/socketIOModel");
// const User = require("../../user/model/userModel")
// const Restaurant = require("../../restaurants/model/restaurantModel")

const {verifyJWT} = require("../../../middlewares/jwt")
const {getMessages,createMessage} = require("../../socketIO/controller/socketController")

const router = express.Router();


router.get("/get-messages", verifyJWT, getMessages);

module.exports = router;
