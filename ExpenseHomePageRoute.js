const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseController');

const auth = require('../middleware/auth')

router.get('/user/expenses', controller.showMainPage)

router.get('/api/userData', auth.auth, controller.getExpensesList)

router.post('/api/userData', auth.auth, controller.addExpense)

router.put('/api/userData/:updateId', auth.auth, controller.updateExpense)

router.delete('/api/userData/:deleteId',auth.auth,  controller.deleteExpense)

module.exports = router;