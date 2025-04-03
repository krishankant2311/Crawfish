const express = require('express')
const route = express.Router()
const reviewController = require("../controller/reviewController")
const {verifyJWT} = require("../../../middlewares/jwt")

const upload = require("../../../middlewares/multer")

route.post("/create-review/:restaurantId",upload.single(),verifyJWT,reviewController.createReview)
route.post("/edit-review/:reviewId",upload.single(),verifyJWT,reviewController.editReview)
route.get("/get-review/:reviewId",upload.single(),verifyJWT,reviewController.getreview)
route.post("/delete-review/:reviewId",upload.single(),verifyJWT,reviewController.deleteReview)
route.get("/get-all-review",upload.single(),verifyJWT,reviewController.getAllReview)
route.get("/get-review-byAdmin/:reviewId",upload.single(),verifyJWT,reviewController.getreviewbyAdmin)
route.get("/get-all-review-byAdmin",upload.single(),verifyJWT,reviewController.getAllReviewbyAdmin)
module.exports = route;