const path = require('path');
const Expense = require('../models/expensetable');
const User = require('../models/user')
const sequelize = require('../util/database')

exports.showMainPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'expenses.html'))
}


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

exports.getAllExpensesforPagination = async (req, res) => {
    try {
      const pageNo = parseInt(req.params.page)
      const limit = parseInt(req.params.limit)
    // limit = 10
  
      const count = await Expense.count({
        where: {
          userId: req.user,
        },
      });
      const totalPages = Math.ceil(count / limit);
  
      const offset = (pageNo - 1) * limit;
      const expenses = await Expense.findAll({
        where: {
          userId: req.user,
        },
        // order: [['id', 'DESC']],
        limit: limit,
        offset: offset,
      });
  
      res.json({ expenses, totalPages });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };



  exports.addExpense = async (req, res) => {
    const t = await sequelize.transaction()
    const { date, description, category, type, amount } = req.body;

    try {
        const addingExpense = await Expense.create({
            date: date,
            description: description,
            category: category,
            type: type,
            amount: amount,
            userId: req.user
        }, { transaction: t }
        );

        const fieldToUpdate = (type === 'expense') ? 'totalexpenses' : 'totalincome';

        await User.update(
            {
                [fieldToUpdate]: sequelize.literal(`${fieldToUpdate} + ${amount}`)
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
            type: addingExpense.type,
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
                userId: userId,

            },
            attributes: ['amount', 'type']
        });


        if (expense) {
            const { amount, type } = expense;

            await Expense.destroy({
                where: {
                    id: ID,
                    userId: userId
                }
            }, { transaction: t });

            const updateField = (type === 'expense') ? 'totalexpenses' : 'totalincome';
            if (type === 'expense') {

            }

            await User.update(
                {
                    [updateField]: sequelize.literal(`${updateField} - ${amount}`)
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
    const t = await sequelize.transaction();
    const userId = req.user;
    const id = req.params.updateId;
    const { date, description, category, type, amount } = req.body;
    const newtype = type;
    console.log(type)

    try {
        const expense = await Expense.findOne({
            where: {
                id: id,
                userId: userId
            },
            attributes: ['amount', 'type']
        });

        if (expense) {
            const { amount: oldAmount, type: oldType } = expense;

            await Expense.update({
                date,
                description,
                category,
                type,
                amount
            },
                {
                    where: {
                        id: id,
                        userId: userId
                    },
                    transaction: t
                });


            if (oldType !== newtype) {
                if (oldType === 'expense') {
                    await User.update(
                        {
                            totalexpenses: sequelize.literal(`totalexpenses - ${oldAmount}`),
                            totalincome: sequelize.literal(`totalincome + ${amount}`)
                        },
                        {
                            where: {
                                id: userId
                            },
                            transaction: t
                        }
                    );
                } else {
                    await User.update(
                        {
                            totalincome: sequelize.literal(`totalincome - ${oldAmount}`),
                            totalexpenses: sequelize.literal(`totalexpenses + ${amount}`)
                        },
                        {
                            where: {
                                id: userId
                            },
                            transaction: t
                        }
                    );
                }
            } else {
                if (newtype === 'expense') {
                    await User.update(
                        {
                            totalexpenses: sequelize.literal(`totalexpenses - ${oldAmount} + ${amount}`)
                        },
                        {
                            where: {
                                id: userId
                            },
                            transaction: t
                        }
                    );
                } else {
                    await User.update(
                        {
                            totalincome: sequelize.literal(`totalincome - ${oldAmount} + ${amount}`)
                        },
                        {
                            where: {
                                id: userId
                            },
                            transaction: t
                        }
                    );
                }
            }
            await t.commit();
            res.json({ date, description, category, type, amount, id });
        } else {
            res.status(404).json({ success: false, message: "Expense not found" });
        }
    } catch (err) {
        await t.rollback();
        res.status(500).json({ success: false, error: err.message });
    }
};

