const express = require("express")
const route = express.Router()
const notificationController = require("../../notification/controllers/notoficationController")
const notificationSenderController = require("../../notification/controllers/notificationSenderController")
const upload = require("../../../middlewares/multer")
const verifyJWT = require("../../../middlewares/jwt")

// route.post("/update-preferences/:userId",notificationController.updatePreferences);
// route.post("/send-notification",notificationController.sendNotification);
route.post("/send-all-notification",notificationSenderController.sendNotification);

module.exports = route