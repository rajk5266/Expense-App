const express = require('express');
const router = express.Router();
const controller = require('../controllers/premium')
const auth = require('../middleware/auth')

router.get('/purchase/premiumMembership',auth.auth, controller.purchasePremium)

router.get('/profile', auth.auth,  controller.isPremium)

router.post('/purchase/premiumMembership',auth.auth, controller.premiumMember)

router.post('/purchase/premiumTransactionFailed', auth.auth, controller.premiumTransactionFailed)

module.exports = router;