const Expense = require("../model/expense");
const User = require("../model/user");
const sequelize = require("../util/database");

exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const amount = req.body.expense;
    const description = req.body.description;
    const category = req.body.category;
    //Expense.create({ amount, description, category, userId: req.user.id })
    const data = await req.user.createExpense(
      { amount, description, category },
      { transaction: t }
    );
    await t.commit();
    let updatedTotalExpense = amount;
    if (req.user.totalexpense) {
      updatedTotalExpense = Number(req.user.totalexpense) + Number(amount);
    }
    await User.update(
      { totalexpense: updatedTotalExpense },
      { where: { id: req.user.id }, transaction: t }
    );
    await t.commit();
    res.status(200).json({ newExpense: data });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(400).json({ err: error });
  }
};

exports.getExpense = (req, res, next) => {
  // Expense.findAll({where:{userId:req.user.id}})
  req.user
    .getExpenses()
    .then((data) => {
      res.status(200).json({ expenses: data });
    })
    .catch((e) => console.log(e));
};

exports.deleteExpense = (req, res, next) => {
  const expId = req.params.expenseId;
  const amount = req.header("price");
  Expense.destroy({ where: { id: expId, userId: req.user.id } })
    .then(() => {
      req.user
        .update({ totalexpense: req.user.totalexpense - amount })
        .then(() => {
          res.status(2000);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};
