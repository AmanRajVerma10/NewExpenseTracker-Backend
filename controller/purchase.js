const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const Order = require("../model/order");

dotenv.config();

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;
    rzp.orders
      .create({ amount, currency: "INR" }, (err, order) => {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        console.log("sddssd", order.id);
        req.user
          .createOrder({ orderid: order.id, status: "PENDING" })
          // Order.create({orderid:order.id,status:'Pending',userId:req.user.id})
          .then(() => {
            res.status(201).json({ order, key_id: rzp.key_id });
          });
      })
      .catch((e) => {
        throw new Error(e);
      });
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: error });
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    const promise1 = order.update({
      paymentid: payment_id,
      status: "Successful",
    });
    const promise2 = req.user.update({ ispremiumuser: true });
    Promise.all([promise1, promise2])
      .then(() => {
        res
          .status(200)
          .json({ success: true, message: "Transaction Successful!" });
      })
      .catch((e) => {
        throw new Error(e);
      });
  } catch (e) {
    console.log(e);
    res.status(400).json({ err: e });
  }
};
