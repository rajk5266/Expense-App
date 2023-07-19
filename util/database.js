const Sequelize = require('sequelize')

const sequelize = new Sequelize('expense-tracker-app', 'root', 'Hannah903@ophio', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;