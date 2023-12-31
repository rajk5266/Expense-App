const Sequelize  = require('sequelize');
const sequelize = require('../util/database');

const Report = sequelize.define('report', {
   id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
   }, 
   date: Sequelize.STRING,
   fileURL: Sequelize.STRING,
   userId:{
    type: Sequelize.INTEGER,
    allowNull:false,
},
 
})
module.exports = Report