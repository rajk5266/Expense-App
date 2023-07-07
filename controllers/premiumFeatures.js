const jwt = require('jsonwebtoken')
const path = require('path')
const Order = require('../models/Order');
const User = require('../models/user');
const Expense = require('../models/expensetable')
const sequelize = require('sequelize')
const { Op } = require('sequelize');

exports.showLeaderboardSection = async (req, res) => {
    console.log(req.user, "------")
    console.log("--->", req.headers, "<----")
    res.sendFile(path.join(__dirname, '..', 'views', 'leaderboard.html'));
};

exports.showStatus = async (req, res) => {
   try{
    const usersWithExpenses = await User.findAll({
        attributes: [
          'id',
          'name',
          [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'totalExpenses'],
        ],
        include: [
          {
            model: Expense,
            as: 'expenses',
            attributes: [],
          },
        ],
        where: {
            ispremium: true
        },
        group: ['users.id'],
        order: [[sequelize.literal('totalExpenses'), 'DESC']],
      });
    const userExpenses = usersWithExpenses.map(user => user.dataValues);
    res.send(userExpenses);
   }catch(err){
    console.log(err)
    res.status(500).json({message: 'internal server error'})
   }
  };