const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard');

const auth = require('../middleware/auth')

router.get('/user/dashboard', controller.showHomePage )

router.get('/user/totalExpenses',auth.auth,  controller.totalExpenses)

router.get('/user/expensesCategoryData', auth.auth, controller.expensesCategory)

router.get('/user/incomesCategoryData', auth.auth, controller.incomesCategory)

router.get('/user/lastEntries', auth.auth, controller.lastEntries)


module.exports = router;