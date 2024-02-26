const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Brevo = require('sib-api-v3-sdk')
require("dotenv").config();

const Expense = require("./model/expense");
const User = require("./model/user");
const Order = require("./model/order");

const sequelize = require("./util/database");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const path = require("./util/path");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumFeatureRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);

app.post("/password/forgotpassword", (req, res, next) => {
  const { email } = req.body;
  const client = Brevo.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;
  const tranEmailApi = new Brevo.TransactionalEmailsApi();
  const sender = {
    email: "verma.aman464@gmail.com",
  };
  const receivers = [
    {
      email: "verma.aman464@gmail.com",
    },
  ];
  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "This is a test",
      textContent: "Hello from node.js",
    })
    .then((data) => {
      console.log(data);
      res.status(200).json(data)
    })
    .catch((e) => {
      console.log(e);
      res.status(400).json(e)
    });
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((e) => console.log(e));
