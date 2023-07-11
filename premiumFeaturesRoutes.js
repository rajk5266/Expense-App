const express = require('express');
const router = express.Router();
const premiumFeaturesControllers = require('../controllers/premiumFeatures')
const auth = require('../middleware/auth')

router.get('/premium/leaderboard', premiumFeaturesControllers.showLeaderboardSection)

router.get('/premium/leaderboardStatus', auth.auth, premiumFeaturesControllers.showStatus)

module.exports = router;