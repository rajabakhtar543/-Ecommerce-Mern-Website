const express = require('express');
const {registercontroller,logincontroller, ResetPassword, ResetRequest, updateProfileController, getAllusers}  = require('../../Users/UserController.js');
const {requireSignin,isAdmin} = require('../../Users/Middlewares/authmiddleware.js');
const router = express.Router();

 
 router.post('/register', registercontroller)
 router.post('/login',logincontroller)
 router.get('/test',requireSignin,isAdmin)
 router.post('/request-reset',ResetRequest)
router.post('/reset-password/:token',ResetPassword)
 router.get('/auth-login',requireSignin,(req,res)=>{
res.status(200).send({ok:true})
})
router.get('/all-users',isAdmin,getAllusers)
 router.get('/admin-login',isAdmin,(req,res)=>{
res.status(200).send({ok:true})
})
router.put("/update-profile",updateProfileController)


module.exports = {router}