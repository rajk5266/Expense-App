const Sequelize = require('sequelize')

const sequelize = new Sequelize('expense-app', 'root', 'ptyasMucosa', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;