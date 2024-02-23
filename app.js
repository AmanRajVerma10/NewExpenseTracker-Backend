const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const Expense = require("./model/expense");
const User = require("./model/user");

const sequelize = require("./util/database");

const userRoutes= require('./routes/user')
const expenseRoutes= require('./routes/expense')
const path = require("./util/path");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use('/user',userRoutes)
app.use('/expense',expenseRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((e) => console.log(e));
