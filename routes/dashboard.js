const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard');

const auth = require('../middleware/auth')

router.get('/dashboard', controller.showHomePage )

router.get('/totalExpenses',auth.auth,  controller.totalExpenses)

router.get('/expensesCategoryData', auth.auth, controller.expensesCategory)

router.get('/incomesCategoryData', auth.auth, controller.incomesCategory)

router.get('/lastEntries', auth.auth, controller.lastEntries)


module.exports = router;