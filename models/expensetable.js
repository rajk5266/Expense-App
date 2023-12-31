const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('expenses', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    date:{
        type: Sequelize.STRING,
        allowNull:false
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false
   },
    category:{
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    amount:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
}) 


module.exports = Expense