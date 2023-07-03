const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseController');

router.get('/user/expenses', controller.showMainPage)

router.get('/userData', controller.getExpensesList)

router.post('/userData', controller.addExpense)

router.put('/userData/:updateId', controller.updateExpense)

router.delete('/userData/:deleteId', controller.deleteExpense)

module.exports = router;