const path = require('path')
const User = require('../models/user');
const sequelize = require('sequelize')

exports.showLeaderboardSection = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'leaderboard.html'));
};

exports.showStatus = async (req, res) => {
    try {
        const usersWithExpenses = await User.findAll({
            attributes: [
              'id',
              'name',
              [
                sequelize.literal('totalincome - totalexpenses'),
                'saved'
              ],
              [
                sequelize.literal('totalexpenses / totalincome * 100'),
                'savedInPercentage'
              ]
            ],
            where: {
              ispremium: true,
            },
            order: [[sequelize.literal('savedInPercentage'), 'ASC']],
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

