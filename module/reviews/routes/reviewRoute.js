const express = require('express')
const route = express.Router()
const reviewController = require("../controller/reviewController")
const {verifyJWT} = require("../../../middlewares/jwt")

const upload = require("../../../middlewares/multer")

route.post("/create-review/:restaurantId",verifyJWT,upload.fields('photos'),reviewController.createReview)
route.post("/edit-review/:reviewId",verifyJWT,upload.none(),reviewController.editReview)
route.get("/get-review/:restaurantId",verifyJWT,reviewController.getallreviewbyuser)
route.post("/delete-review/:reviewId",verifyJWT,upload.none(),reviewController.deleteReview)
route.post("/publish-review/:reviewId",verifyJWT,upload.none(),reviewController.updateRestaurantstatus)
route.get("/get-all-review/:restaurantId",verifyJWT,reviewController.getallreviewbyuser)
route.get("/get-review-byAdmin/:reviewId",verifyJWT,reviewController.getreviewbyAdmin)
route.get("/get-all-review-byAdmin",verifyJWT,reviewController.getAllReviewbyAdmin)
route.get("/get-all-review-byRestaurant",verifyJWT,reviewController.getAllReviewbyRestaurant)
route.get("/get-average-review-byUser/:restaurantId",verifyJWT,reviewController.getreviewaverages)
module.exports = route;