const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet= require('helmet');
const morgan=require('morgan')
const fs= require('fs')
const path= require('path')

const Expense = require("./model/expense");
const User = require("./model/user");
const Order = require("./model/order");
const ForgotPassword= require("./model/forgotpassword")
const filesdownloaded= require('./model/filesdownloaded')

const sequelize = require("./util/database");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const resetPasswordRoutes= require("./routes/resetpassword")


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(helmet());

const accessLogStream=fs.createWriteStream(
  path.join(__dirname,'access.log'),
  {flags: 'a'}
)

app.use(morgan('combined',{stream:accessLogStream}))


app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumFeatureRoutes);
app.use(resetPasswordRoutes);


User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User)
User.hasMany(filesdownloaded);
filesdownloaded.belongsTo(User);


sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((e) => console.log(e));
