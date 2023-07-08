const path = require('path');
const Expense = require('../models/expensetable');
const User = require('../models/user')
const sequelize = require('sequelize')

exports.showMainPage = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'expenses.html'));
};

exports.getExpensesList = async (req, res) => {
    try {
        const userId = req.user;
        const response = await Expense.findAll({
            where: {
                userId: userId
            }
        })
        res.send(response)
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}
exports.addExpense = async (req, res) => {
    const { date, description, category, amount } = req.body;

    try {
        const response = await Expense.create({
            date: date,
            description: description,
            category: category,
            amount: amount,
            userId: req.user
        });

        const { id, date: expenseDate, description, category, amount: expenseAmount } = response.dataValues;

        await User.update(
            {
                totalexpenses: sequelize.literal(`totalexpenses + ${expenseAmount}`)
            },
            {
                where: { id: req.user }
            }
        );

        res.status(200).json({
            success: true,
            expense: {
                id,
                date: expenseDate,
                description,
                category,
                amount: expenseAmount
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const ID = req.params.deleteId;
    const userId = req.user;

    try {
        // const expense = await 
        const expense = await Expense.findOne({
            where: {
                id: ID,
                userId: userId
            },
            attributes: ['amount']
        });

        if (expense) {
            const amountToSubtract = expense.amount;

            await Expense.destroy({
                where: {
                    id: ID,
                    userId: userId
                }
            });
            await User.update(
                {
                    totalexpenses: sequelize.literal(`totalexpenses - ${amountToSubtract}`)
                },
                {
                    where: {
                        id: userId
                    }
                }
            );

            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "Expense not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.updateExpense = async (req, res) => {
    // console.log(req.body)
    const userId = req.user
    const ID = req.params.updateId;
    const { date, description, category, amount } = req.body;

    try {
        const expense = await Expense.findOne({
            where: {
                id:ID,
                userId: userId
            },
            attributes: ['amount']
        });
        const oldAmount = expense.amount;
        
        await Expense.update({
            date,
            description,
            category,
            amount
        },
        {
            where: {
                id: ID,
                userId: userId
            }
        }
        );
        await User.update({
            totalexpenses: sequelize.literal(`totalexpenses - ${oldAmount} + ${amount}`)
        },
        {
            where: {
                id: userId
            }
        }
        )
        res.json({ date, description, category, amount });
    } catch (err) {
        res.status(500).json({ message: 'internal srver error' })
    }
    
}

