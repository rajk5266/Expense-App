const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const controller = require('../controllers/resetPassword')


router.get('/forgotPassword', controller.showforgotPasswordForm )

router.post('/forgotPassword',auth.auth,  controller.forgotPassword)

router.get('/password/resetpassword/:id', controller.showResetPasswordForm)

router.post('/password/resetPassword', controller.updatePassword)

module.exports = router