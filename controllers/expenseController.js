const path = require('path');
const mongoose = require('mongoose')
const Expense = require('../models/expensetable');
const User = require('../models/user')
const mongoDb = require('mongodb')

exports.showMainPage = async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'expenses.html'));
};

// exports.getExpensesList = async (req, res) => {
//     try {
//         const userId = req.user;
//         const response = await Expense.findAll({
//             where: {
//                 userId: userId
//             }
//         })
//         res.send(response)
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, error: 'Internal server error' });
//     }
// }

// exports.getAllExpensesforPagination = async (req, res) => {
//     try {
//       const pageNo = parseInt(req.params.page)
//       const limit = parseInt(req.params.limit)
//     // limit = 10
  
//       const count = await Expense.count({
//         where: {
//           userId: req.user,
//         },
//       });
//       const totalPages = Math.ceil(count / limit);
  
//       const offset = (pageNo - 1) * limit;
//       const expenses = await Expense.findAll({
//         where: {
//           userId: req.user,
//         },
//         // order: [['id', 'DESC']],
//         limit: limit,
//         offset: offset,
//       });
  
//       res.json({ expenses, totalPages });
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ success: false, error: 'Internal server error' });
//     }
//   };


exports.getExpensesList = async (req, res) => {
    try {
        const userId = req.user;
        const response = await Expense.find({ userId });
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.getAllExpensesforPagination = async (req, res) => {
    try {
        const pageNo = parseInt(req.params.page);
        const limit = parseInt(req.params.limit);
        // limit = 10
  
        const count = await Expense.countDocuments({
            userId: req.user,
        });
        const totalPages = Math.ceil(count / limit);
  
        const offset = (pageNo - 1) * limit;
        const expenses = await Expense.find({
            userId: req.user,
        })
        .limit(limit)
        .skip(offset);
  
        res.json({ expenses, totalPages });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

exports.addExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    const { date, description, category, type, amount } = req.body;

    try {
        const addingExpense = new Expense({
            date: date,
            description: description,
            category: category,
            type: type,
            amount: amount,
            userId: req.user
        }
        );

        await addingExpense.save({session})

        const fieldToUpdate = (type === 'expense') ? 'totalexpenses' : 'totalincome';

        await User.updateOne(
            { _id: req.user },
            {
                $inc: { [fieldToUpdate]: amount }
            },
            { session }
        );
         await session.commitTransaction();
         session.endSession();

        const response = {
            _id: addingExpense.id,
            date: addingExpense.date,
            description: addingExpense.description,
            category: addingExpense.category,
            type: addingExpense.type,
            amount: addingExpense.amount
        };
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


exports.deleteExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const ID = req.params.deleteId;
    console.log(ID)
    const userId = req.user;

    try {
        const expense = await Expense.findOne({
            _id: ID,
            userId: userId
        }, 'amount type').session(session);

        if (expense) {
            const { amount, type } = expense;

            await Expense.deleteOne({ _id: ID, userId: userId }).session(session);

            const updateField = (type === 'expense') ? 'totalexpenses' : 'totalincome';

            await User.updateOne(
                { _id: userId },
                { $inc: { [updateField]: -amount } },
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "Expense not found" });
        }
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.updateExpense = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    let userId = req.user;
    const id = req.params.updateId;
    
    const { date, description, category, type, amount } = req.body;
    const newType = type;
    const newAmount = parseInt(amount);

    try {
        const expense = await Expense.findOne({
            _id: id,
            userId: userId
        }, 'amount type').session(session);

        if (expense) {
            const { amount: oldAmount, type: oldType } = expense;

            await Expense.updateOne(
                { _id: id, userId: userId },
                { date, description, category, type, amount },
                { session }
            );

            const updateFields = {};
            if (oldType !== newType) {
                if (oldType === 'expense') {
                    updateFields.$inc = { totalexpenses: -oldAmount, totalincome: newAmount };
                } else {
                    updateFields.$inc = { totalincome: -oldAmount, totalexpenses: newAmount };
                }
            } else {
                if (newType === 'expense') {
                    updateFields.$inc = { totalexpenses: -oldAmount + newAmount };
                } else {
                    updateFields.$inc = { totalincome: -oldAmount + newAmount };
                }
            }

            await User.updateOne(
                { _id: userId },
                updateFields,
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            res.json({ date, description, category, type, amount, id });
        } else {
            res.status(404).json({ success: false, message: "Expense not found" });
        }
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, error: err.message });
    }
};
