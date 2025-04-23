const express=require('express')
const route=express.Router();
const adminController =require("../controller/adminController")
const {verifyJWT} = require("../../../middlewares/jwt")
const upload = require ("../../../middlewares/multer")

route.post('/admin-login', upload.none(),adminController.loginAdmin);
route.post('/admin-forgotPassword', upload.none(),adminController.adminForgotPassword)
route.post('/admin-verifyOtp', upload.none(),adminController.verifyOtp)
route.post('/admin-changeForgot-password', upload.none(),adminController.changeForgotPassword)
route.post('/admin-changePassword',verifyJWT,upload.none(),adminController.changepassword)
route.post('/admin-logout',verifyJWT, upload.none(),adminController.adminLogout)
route.post('/admin-editProfile',verifyJWT, upload.none(),adminController.editAdminProfile)
route.post('/add-subadmin',verifyJWT, upload.none(),adminController.addSubAdmin)
route.get('/get-subadmin/:_id',verifyJWT, upload.none(),adminController.getSubAdmin)
route.get('/get-all-subadmin',verifyJWT, upload.none(),adminController.getAllSubAdmin)
route.post('/delete-SubAdmin/:adminId',verifyJWT, upload.none(),adminController.deleteSubAdmin)
route.post('/edit-SubAdmin',verifyJWT, upload.none(),adminController.editSubAdmin)
route.get('/get-dashboard-piechart',verifyJWT, upload.none(),adminController.getDashboardPiechart)



module.exports=route;