const express = require("express")

const route = express.Router()
const favouriteController = require("../../favourite/controller/favouritecontroller")
const upload = require("../../../middlewares/multer")
const {verifyJWT} = require("../../../middlewares/jwt")

route.post("/add-fav-restaurant/:resId",verifyJWT,upload.none(),favouriteController.addfavourite);
route.get("/getAll-fav-restaurant",verifyJWT,favouriteController.getAllFavouriteRestaurant);
route.post("/delete-fav-restaurant/:resId",verifyJWT,upload.none(),favouriteController.deleteFavouriteRestaurant);
route.get("/get-fav-restaurant/:resId",verifyJWT,upload.none(),favouriteController.getfavouriteRestaurant);

 module.exports = route;