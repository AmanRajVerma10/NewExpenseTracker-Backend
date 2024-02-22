const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const Expense = require("./model/expense");
const User = require("./model/user");

const sequelize = require("./util/database");

const path = require("./util/path");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.get("/expense", (req, res, next) => {
  Expense.findAll()
    .then((data) => {
      res.status(200).json({ expenses: data });
    })
    .catch((e) => console.log(e));
});

app.post("/expense/add-expense", (req, res, next) => {
  const amount = req.body.expense;
  const description = req.body.description;
  const category = req.body.category;
  Expense.create({ amount, description, category })
    .then((data) => {
      res.status(200).json({ newExpense: data });
    })
    .catch((e) => console.log(e));
});

app.delete("/expense/delete-expense/:expenseId", (req, res, next) => {
  const expId = req.params.expenseId;
  Expense.destroy({ where: { id: expId } })
    .then(() => {
      res.status(2000);
    })
    .catch((e) => {
      console.log(e);
    });
});

app.post("/user/sign-up", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (name.length == 0 || email.length == 0 || password.length == 0) {
      return res.status(400).json({ error: "invalid params" });
    }
    const data = await User.create({ name, email, password });
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

app.post("/user/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email: email, password: password },
    });
    if (user) {
      res.status(200).json({ data: user });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).json({err:error})
  }
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((e) => console.log(e));
