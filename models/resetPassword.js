const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const resetPasswordRequests = sequelize.define('forgotpasswordrequests', {
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    userId:{
        type: Sequelize.INTEGER,
        allowNull:false,
    },
    isactive:{
        type: Sequelize.BOOLEAN,
        defaultValue: true
   }
}) 

module.exports = resetPasswordRequests