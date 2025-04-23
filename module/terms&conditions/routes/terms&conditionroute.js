const express = require('express')
const {verifyJWT} = require("../../../middlewares/jwt")
const route =  express.Router()
const upload = require("../../../middlewares/multer")
const termsConditionsController = require("../controller/terms&conditioncontroller")



route.post("/create-termsConditions",verifyJWT,upload.none(),termsConditionsController.createTermsAndCondition)
route.get("/get-termsConditions",verifyJWT,termsConditionsController.getTermsAndCondition)


module.exports = route;