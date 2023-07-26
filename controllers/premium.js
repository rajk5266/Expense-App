require("dotenv").config(); 
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/user');

exports.purchasePremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET
    });
    const amount = 200 * 100;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Failed to create Razorpay order' });
      }
      try {
        await Order.create({ orderid: order.id, status: 'PENDING' });
        return res.status(201).json({ order, key_id: rzp.key_id });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to create order' });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: 'something went wrong', error: err })
  }
};

exports.premiumMember = async (req, res) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    if (!order) {
      throw new Error("Order not found");
    }
    await order.update({ paymentid: payment_id, status: 'SUCCESSFULL' });

    await User.update({ ispremium: true }, { where: { id: req.user } });

    return res.status(202).json({ success: true, message: "Transaction successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Transaction failed" });
  }
};



exports.premiumTransactionFailed = async (req, res) => {
  try {
    const orderid = req.body.orderid;
    const order = await Order.findOne({ where: { orderid } });

    if (order) {
      await order.update({ status: 'FAILED' });
      await User.update({ ispremium: false }, { where: { id: req.user } });
      return res.status(202).json({ success: true, message: "Transaction failed" });
    } else {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.isPremium = async (req, res) => {
  console.log("ispremium", req.user)

  try {
    const user = await User.findOne({ where: { id: req.user } });
    if (user) {
      const ispremium = user.ispremium;
      res.status(200).json({ ispremium });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to check premium status' });
  }
};