const User = require('../models/user');
const Expense = require('../models/expensetable')
const { Op } = require('sequelize');
const sequelize = require('../util/database');

exports.generateDailyReport = async (userId, date)=>{
    try {
        const username = await User.findOne({where:{
            id: userId
        }})
        const UserName = username['dataValues']['name']
        const dailyReport = await Expense.findAll({
            where: {
                date,
                userId
            }
        })
        const reportData = dailyReport.map((expense) => {
            const date = expense.dataValues.date;
            const description = expense.dataValues.description;
            const category = expense.dataValues.category;
            const type = expense.dataValues.type;
            const amount = expense.dataValues.amount;
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
        const username = await User.findOne({where:{
            id:userId
        }})
        const UserName = username['dataValues']['name']

        const monthlyReport = await Expense.findAll({
            where: {
                userId,
                [Op.and]: sequelize.literal(`MONTH(date) = ${month}`),
            },
            order: [
                ['date', 'ASC'] 
            ]
        })
        const reportData = monthlyReport.map((expense) => {
            const date = expense.dataValues.date;
            const description = expense.dataValues.description;
            const category = expense.dataValues.category;
            const type = expense.dataValues.type;
            const amount = expense.dataValues.amount;
            const name = UserName
            return { date, description , category,type, amount , name}; 
          });
        return reportData
    } catch (err) {
        console.log(err)
    }
}

exports.generateCustomDateReport = async (userId, startDate, endDate) => {
    try {
        const username = await User.findOne({where:{
            id: userId
        }})
        const UserName = username['dataValues']['name']
        
        console.log(startDate, "===", endDate)
        const customReport = await Expense.findAll({
            where: {
                userId,
                date: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate,
                  },
            },
            order: [
                ['date', 'ASC'] 
            ]
        })
        const reportData = customReport.map((expense) => {
            const date = expense.dataValues.date;
            const description = expense.dataValues.description;
            const category = expense.dataValues.category;
            const type = expense.dataValues.type;
            const amount = expense.dataValues.amount;
            const name = UserName
            return { date, description , category, type,amount , name}; 
          });
        return reportData

    } catch (err) {
        console.log(err)
    }
}
