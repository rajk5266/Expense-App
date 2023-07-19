const express = require('express');
const router = express.Router();
const controller = require('../controllers/premiumcontroller')
const auth = require('../middleware/auth')

router.get('/purchase/premiumMembership',auth.auth, controller.purchasePremium)

router.get('/user/profile', auth.auth,  controller.isPremium)

router.post('/purchase/premiumMembership',auth.auth, controller.premiumMember)

router.post('/purchase/cancelPremium', auth.auth, controller.cancelPremium)

module.exports = router;