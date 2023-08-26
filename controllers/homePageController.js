const path = require('path')
const User = require('../models/user')
const Expense = require('../models/expensetable');
const mongoose = require('mongoose')
const mongoDb = require('mongodb')
exports.showHomePage = async (req, res) => {

    res.sendFile(path.join(__dirname, '..', 'views', 'homePage.html'));
};


exports.totalExpenses = async (req, res) => {
  try {
    const totalExpenses = await User.findById(req.user);
    res.send(totalExpenses);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: 'user not found' });
  }
};

// exports.expensesCategory = async (req, res) => {
//   try {
//     const data = await Expense.aggregate([
//       {
//         $match: {
//           userId: new mongoDb.ObjectId(req.user),
//           type: 'expense',
//         },
//       },
//       {
//         $group: {
//           _id: '$category',
//           totalAmount: { $sum: '$amount' },
//         },
//       },
//     ]);

//     res.send(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// };

// exports.incomesCategory = async (req, res) => {
//   try {
//     const data = await Expense.aggregate([
//       {
//         $match: {
//           userId: new mongoDb.ObjectId(req.user), // Use it with 'new'
//           type: 'income',
//         },
//       },
//       {
//         $group: {
//           _id: '$category',
//           totalAmount: { $sum: '$amount' },
//         },
//       },
//     ]);

//     res.send(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, error: 'Internal server error' });
//   }
// };


exports.lastEntries = async (req, res) => {
  console.log(req.user);
  try {
    const lastEntries = await Expense.find({ userId: new mongoDb.ObjectId(req.user) })
      .sort({ createdAt: -1 })
      .limit(5);
    res.send(lastEntries);
  } catch (err) {
    console.log(err);
  }
};
