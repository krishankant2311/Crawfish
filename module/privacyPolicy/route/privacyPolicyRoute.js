const express = require("express");
const route = express.Router();
const {verifyJWT} = require("../../../middlewares/jwt");
const upload = require('../../../middlewares/multer');
const privacypolicyController = require('../../privacyPolicy/controller/privacyPolicyController');
route.post('/create-privacy-policy', upload.none(),verifyJWT, privacypolicyController.createPrivacyPolicy)
route.get('/get-privacy-policy',upload.none(), verifyJWT, privacypolicyController.getPrivacyPolicy)
module.exports = route;