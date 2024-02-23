const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Expense = require("./model/expense");
const User = require("./model/user");

const sequelize = require("./util/database");

const path = require("./util/path");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(cors());

User.hasMany(Expense);
Expense.belongsTo(User);

const Authenticate = async (req, res, next) => {
  try {
    const token = req.header("authorization");
    const user = jwt.verify(token, "secretkey10");
    const authenticatedUser = await User.findByPk(user.userId);
    req.user = authenticatedUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false });
  }
};
function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name }, "secretkey10");
}

app.get("/expense", Authenticate, (req, res, next) => {
  // Expense.findAll({where:{userId:req.user.id}})
  req.user
    .getExpenses()
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
    if (name.length === 0 || email.length === 0 || password.length === 0) {
      return res.status(400).json({ err: "Bad params!" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      try {
        console.log(err);
        const data = await User.create({ name, email, password: hash });
        res.status(201).json({ message: "Successfully signed up!" });
      } catch (e) {
        res.status(400).json(e);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.post("/user/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ msg: "no user found" });
    }
    bcrypt.compare(password, user.password, (error, result) => {
      if (error) {
        res
          .status(400)
          .json({ success: "false", message: "Something went wrong!" });
      }
      if (result === true) {
        res.status(200).json({
          success: true,
          message: "Logged in!",
          token: generateAccessToken(user.id, user.name),
        });
      }
      if (result === false) {
        res.status(200).json({ success: false, message: "Invalid password" });
      }
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((e) => console.log(e));
