const User = require('../models/user');
const Expense = require('../models/expensetable')
const { Op } = require('sequelize');
const mongoose = require('mongoose')
const mongoDb = require('mongodb')

exports.generateDailyReport = async (userId, date)=>{
    try {console.log(typeof(date))
        const username = await User.findOne({
            _id: userId
        })
        const UserName = username.name
        console.log(UserName)
        const dailyReport = await Expense.find({
                date: date,
                userId: userId
        })
        // console.log(dailyReport)
        const reportData = dailyReport.map((expense) => {
            const date = expense.date;
            const description = expense.description;
            const category = expense.category;
            const type = expense.type;
            const amount = expense.amount;
            const name = UserName
            return { date, description , category,type, amount , name}; // Create an object with the desired properties
          });
        return reportData
    } catch (err) {
        console.log(err)
    }
}
exports.generateMonthlyReport = async (userId, month) => {
    try {
        const username = await User.findOne({
            _id: userId
        });
        const UserName = username.name;

        const monthlyReport = await Expense.find({
            userId,
            date: {
                $gte: new Date(new Date().getFullYear(), month - 1, 1).toISOString().split('T')[0],
                $lt: new Date(new Date().getFullYear(), month, 1).toISOString().split('T')[0]
            }
        }).sort({ date: 'asc' });

        const reportData = monthlyReport.map((expense) => {
            const date = new Date(expense.date);
            const description = expense.description;
            const category = expense.category;
            const type = expense.type;
            const amount = expense.amount;
            const name = UserName;
            return { date, description, category, type, amount, name };
        });

        return reportData;
    } catch (err) {
        console.log(err);
    }
};


exports.generateCustomDateReport = async (userId, startDate, endDate) => {
    try {
        const username = await User.findOne({
            _id: userId
        });
        const UserName = username.name;

        const customReport = await Expense.find({
            userId,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 'asc' });

        const reportData = customReport.map((expense) => {
            const date = expense.date;
            const description = expense.description;
            const category = expense.category;
            const type = expense.type;
            const amount = expense.amount;
            const name = UserName;
            return { date, description, category, type, amount, name };
        });

        return reportData;

    } catch (err) {
        console.log(err);
    }
};
