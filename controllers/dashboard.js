const path = require('path')
const User = require('../models/user')
const Expense = require('../models/expensetable');
const sequelize = require('sequelize')
exports.showHomePage = async (req, res) => {

    res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
};

exports.totalExpenses = async(req, res) => {
    try{
       const totalExpenses = await User.findAll({
            where: {
                id: req.user,
            }
       })
       res.send(totalExpenses)
    }catch(err){
        console.log(err)
        res.send(404).json({mesage: 'user not found'})
    }
}

exports.expensesCategory = async (req, res) => {
    try {
      const data = await Expense.findAll({
        attributes: ['category', [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']],
        where: {
          userId: req.user,
          type: 'expense',
        },
        group: 'category',
      });
  
      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };

exports.incomesCategory = async (req, res) => {
    try {
      const data = await Expense.findAll({
        attributes: [ 'category', [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']],
        where: {
          userId: req.user,
          type: 'income',
        },
        group: 'category'
      });

      res.send(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };

exports.lastEntries = async(req, res) => {
    console.log(req.user)
    try{
       const lastEntries = await Expense.findAll({
        
            where: {
                userId: req.user
            },
            order: [['createdAt', 'DESC']],
            limit: 5,
       })
       res.send(lastEntries)
    }catch(err){
        console.log(err)
    }
  }
  