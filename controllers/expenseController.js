const path = require('path');
const Expense = require('../models/expensetable');
const User = require('../models/user')
const sequelize = require('../util/database')

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
    const t = await sequelize.transaction()
    const { date, description, category, amount } = req.body;

    try {
        const addingExpense = await Expense.create({
            date: date,
            description: description,
            category: category,
            amount: amount,
            userId: req.user
        }, { transaction: t }
        );

        await User.update(
            {
                totalexpenses: sequelize.literal(`totalexpenses + ${amount}`)
            },
            {
                where: { id: req.user },
                transaction: t
            }
        );

        t.commit()

        const response = {
            id: addingExpense.id,
            date: addingExpense.date,
            description: addingExpense.description,
            category: addingExpense.category,
            amount: addingExpense.amount
        };

        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        t.rollback()
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction()
    const ID = req.params.deleteId;
    const userId = req.user;

    try {
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
            }, { transaction: t });
            await User.update(
                {
                    totalexpenses: sequelize.literal(`totalexpenses - ${amountToSubtract}`)
                },
                {
                    where: {
                        id: userId
                    }, transaction: t
                }
            );
            t.commit()

            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "Expense not found" });
        }
    } catch (error) {
        t.rollback()
        res.status(500).json({ success: false, error: error.message });
    }
};


exports.updateExpense = async (req, res) => {
    const t = await sequelize.transaction()
    // console.log(req.body)
    const userId = req.user
    const id = req.params.updateId;
    const { date, description, category, amount } = req.body;

    try {
        const expense = await Expense.findOne({
            where: {
                id: id,
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
                    id: id,
                    userId: userId
                }
            }, { transaction: t }
        );
        await User.update({
            totalexpenses: sequelize.literal(`totalexpenses - ${oldAmount} + ${amount}`)
        },
            {
                where: {
                    id: userId
                }, transaction: t
            }
        )
        t.commit()
        res.json({ date, description, category, amount, id });
    } catch (err) {
        t.rollback()
        res.status(500).json({ message: 'internal srver error' })
    }

}

