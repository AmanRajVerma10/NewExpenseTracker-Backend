const Razorpay = require("razorpay");
const dotenv=require('dotenv');
const Order= require('../model/order')

dotenv.config();

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      console.log("saaad",order);
      req.user
        .createOrder({ orderid: order.id, status: "PENDING" })
        .then(() => {
          res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((e) => {
          throw new Error(e);
        });
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: error });
  }
};
