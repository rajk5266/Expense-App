require("dotenv").config(); 
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/user');
const mongoDb = require('mongodb')

exports.purchasePremium = async (req, res) => {
  try {
      const rzp = new Razorpay({
          key_id: process.env.KEY_ID,
          key_secret: process.env.KEY_SECRET,
      });
      const amount = 200 * 100;

      const order = await rzp.orders.create({ amount, currency: "INR" });

      try {
          await Order.create({ orderId: order.id, status: 'PENDING', userId: req.user });
          res.status(201).json({ order, key_id: rzp.key_id });
      } catch (error) {
          console.log(error);
          res.status(500).json({ message: 'Failed to create order' });
      }
  } catch (error) {
      console.log(error);
      res.status(403).json({ message: 'something went wrong', error });
  }
};

exports.premiumMember = async (req, res) => {
  try {
      const { payment_id, order_id } = req.body;
      console.log(payment_id, "dedwd", order_id);
      const order = await Order.findOne({ orderId: order_id });
       console.log(order)
      if (order) {
          await order.updateOne({ orderId: order_id, status: 'SUCCESSFULL' });

          await User.updateOne({ _id: req.user }, { ispremium: true });

          res.status(202).json({ success: true, message: "Transaction successful" });
      } else {
          res.status(404).json({ success: false, message: "Order not found" });
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Transaction failed" });
  }
};

exports.cancelPremium = async (req, res) => {
  try {
      const orderid = req.body.orderid;
      const order = await Order.findOne({ orderId: orderid });

      if (order) {
          await order.updateOne({ status: 'FAILED' });

          await User.updateOne({ _id: req.user }, { ispremium: false });

          res.status(202).json({ success: true, message: "Transaction failed" });
      } else {
          res.status(404).json({ success: false, message: "Order not found" });
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Transaction failed" });
  }
};


exports.isPremium = async (req, res) => {
  const isUserPremium = new mongoDb.ObjectId(req.user) 
  
  try {
    const user = await User.findById({_id: isUserPremium });
    if (user) {
      const isPremium = user.ispremium;
      res.status(200).json({ ispremium: isPremium });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to check premium status' });
  }
};