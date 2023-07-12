const jwt = require('jsonwebtoken')
const path = require('path')
const Order = require('../models/Order');
const User = require('../models/user');
const Expense = require('../models/expensetable')
const sequelize = require('sequelize')
const {Op} = require('sequelize')
exports.showLeaderboardSection = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'leaderboard.html'));
};

exports.showStatus = async (req, res) => {
    try {

        const usersWithExpenses = await User.findAll({
            attributes: [
                'id',
                'name',
                [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'totalExpenses'],
            ],
            include: [
                {
                    model: Expense,
                    attributes: [],
                },
            ],
            where: {
                ispremium: true
            },
            group: ['users.id'],
            order: [[sequelize.literal('totalExpenses'), 'DESC']],
        });
        if (usersWithExpenses.length === 0) {
            return res.status(404).json({ message: 'user not found' });
        }
        const userExpenses = usersWithExpenses.map(user => user.dataValues);
        res.send(userExpenses);
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'internal server error' })
    }
};

exports.showReport = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'report.html'))
}

exports.showdailyReportData = async (req, res) => {
    try {
        const username = await User.findOne({where:{
            id: req.user
        }})
        const UserName = username['dataValues']['name']
        const { Date } = req.body
        console.log(Date)
        const dailyReport = await Expense.findAll({
            where: {
                date: Date,
                userId: req.user
            }
        })
        const reportData = dailyReport.map((expense) => {
            const date = expense.dataValues.date;
            const description = expense.dataValues.description;
            const category = expense.dataValues.category;
            const amount = expense.dataValues.amount;
            const name = UserName
            return { date, description , category, amount , name}; // Create an object with the desired properties
          });
        //   console.log(reportData)
        res.send(reportData)
    } catch (err) {
        console.log(err)
    }
}


exports.showmonthlyReportData = async (req, res) => {
    try {
        const username = await User.findOne({where:{
            id: req.user
        }})
        const UserName = username['dataValues']['name']

        const { month } = req.body
        const monthlyReport = await Expense.findAll({
            where: {
                userId: req.user,
                [Op.and]: sequelize.literal(`MONTH(date) = ${month}`),
            }
        })
        const reportData = monthlyReport.map((expense) => {
            const date = expense.dataValues.date;
            const description = expense.dataValues.description;
            const category = expense.dataValues.category;
            const amount = expense.dataValues.amount;
            const name = UserName
            return { date, description , category, amount , name}; // Create an object with the desired properties
          });
        res.send(reportData)
    } catch (err) {
        console.log(err)
    }
}

exports.showCustomDateReport = async (req, res) => {
    try {
        const username = await User.findOne({where:{
            id: req.user
        }})
        const UserName = username['dataValues']['name']
        const { startDate, endDate } = req.body
        const customReport = await Expense.findAll({
            where: {
                userId: req.user,
                date: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                  },
            }
        })
        const reportData = customReport.map((expense) => {
            const date = expense.dataValues.date;
            const description = expense.dataValues.description;
            const category = expense.dataValues.category;
            const amount = expense.dataValues.amount;
            const name = UserName
            return { date, description , category, amount , name}; 
          });
        res.send(reportData)

    } catch (err) {
        console.log(err)
    }
}