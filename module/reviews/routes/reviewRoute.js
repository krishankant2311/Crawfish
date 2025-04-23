const express = require('express')
const route = express.Router()
const reviewController = require("../controller/reviewController")
const {verifyJWT} = require("../../../middlewares/jwt")

const upload = require("../../../middlewares/multer")

route.post("/create-review/:restaurantId",verifyJWT,upload.single(),reviewController.createReview)
route.post("/edit-review/:reviewId",verifyJWT,upload.single(),reviewController.editReview)
route.get("/get-review/:reviewId",verifyJWT,upload.single(),reviewController.getreview)
route.post("/delete-review/:reviewId",verifyJWT,upload.single(),reviewController.deleteReview)
route.get("/get-all-review",verifyJWT,upload.single(),reviewController.getAllReview)
route.get("/get-review-byAdmin/:reviewId",verifyJWT,upload.single(),reviewController.getreviewbyAdmin)
route.get("/get-all-review-byAdmin",verifyJWT,upload.single(),reviewController.getAllReviewbyAdmin)
route.get("/get-all-review-byRestaurant",verifyJWT,upload.single(),reviewController.getAllReviewbyRestaurant)
module.exports = route;