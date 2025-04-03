const express = require("express")

const route = express.Router()

const prefrenceController = require("../../prefrences/controller/prefrenceController")

const {verifyJWT} = require("../../../middlewares/jwt")
const upload = require("../../../middlewares/multer")

route.post("/create-preferences",verifyJWT,upload.single('image'),prefrenceController.createpreferences)
route.post("/update-Preferences/:preferenceId",verifyJWT,upload.single('image'),prefrenceController.updatePreferences)
route.get("/get-preferences/:preferenceId",verifyJWT,upload.none(),prefrenceController.getpreferences)
route.post("/delete-Preferences/:preferenceId",verifyJWT,upload.none(),prefrenceController.deletePreference)
route.get("/getAll-active-Preferences",verifyJWT,upload.none(),prefrenceController.getAllActivePrefernce)
route.get("/getAll-Preference",verifyJWT,upload.none(),prefrenceController.getAllPrefernces)

module.exports = route