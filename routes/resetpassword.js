const express= require('express');

const resetPasswordController= require('../controller/resetpassword')

const router= express.Router();

router.get('/password/updatepassword/:resetpasswordid',resetPasswordController.updatePassword);

router.post('/password/forgotpassword',resetPasswordController.forgotPassword);

router.get('/password/resetpassword/:id',resetPasswordController.resetPassword)

module.exports=router;