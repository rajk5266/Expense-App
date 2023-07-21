require('dotenv').config()
const Sequelize = require('sequelize')
console.log('---->')
const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_ID, process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
});

module.exports = sequelize;