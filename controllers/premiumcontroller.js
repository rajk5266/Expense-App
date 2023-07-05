const Razorpay = require('razorpay');
const Order = require('../models/Order');
const User = require('../models/user');

exports.purchasePremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: 'rzp_test_IMNLKyxKWKpLSZ',
      key_secret: 'DdyapcdoA9pZuESXEQxz7nGS'
    });
    const amount = 2000;

    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
        console.log(order)
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
    res.status(403).json({ message: 'something went wrong', error: err})
  }
};

exports.premiumMember = async (req, res) =>{
  try{
    // console.log( "---", req.user)
    const { payment_id, order_id} = req.body;
    Order.findOne({ where : { orderid: order_id}}).then((order) =>{
      order.update({ paymentid: payment_id, status: 'SUCCESSFULL'}).then(() =>{
        User.update({ ispremium: true },
          {where : {id: req.user}}).then(() => {
          return res.status(202).json({ success: true, message: "Transaction successful"});
        }).catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        // throw new Error
        console.log(err)
      })
      
    }).catch(err => {throw new Error})

  }catch(err){
     console.log(err)
  }
}


exports.cancelPremium = async (req, res) =>{
  try{
    const data = req.body.orderid
    Order.findOne({ where : { orderid: data}}).then((order) =>{
      order.update({ status: 'FAILED'}).then(() =>{
        User.update({ ispremium: false },
          {where : {id: req.user}}).then(() => {
          return res.status(202).json({ success: true, message: "Transaction failed"});
        }).catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        // throw new Error
        console.log(err)
      })
      
    }).catch(err => {console.log(err)})

  }catch(err){
     console.log(err)
  }
}