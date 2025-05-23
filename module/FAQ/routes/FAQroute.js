const express = require('express')
const route = express.Router()
const faqController= require('../controllers/FAQcontrollers')
const {verifyJWT} = require('../../../middlewares/jwt')
const upload = require('../../../middlewares/multer')

route.post("/create-faq",verifyJWT,upload.none(),faqController.createFAQ)
// route.post("/find-faq",faqController.findFAQ)
route.post("/edit-faq",verifyJWT,upload.none(),faqController.editFAQ)
route.get("/get-faq/:id",verifyJWT,upload.none(),faqController.getFAQ)
route.get("/get-all-faq",verifyJWT,upload.none(),faqController.getAllFAQ)
route.get("/get-all-faq-byUser",verifyJWT,upload.none(),faqController.getAllFAQByUser)
route.post("/delete-faq",verifyJWT,upload.none(),faqController.deleteFAQ)


module.exports = route