const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const controller = require('../controllers/resetPasswordController')


router.get('/user/forgotPassword', controller.showforgotPasswordForm )

router.post('/user/forgotPassword',auth.auth,  controller.forgotPassword)

router.get('/password/resetpassword/:id', controller.showResetPasswordForm)

router.post('/password/resetPassword', controller.updatePassword)

module.exports = router