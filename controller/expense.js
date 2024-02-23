const Expense=require('../model/expense')

exports.addExpense=(req, res, next) => {
    const amount = req.body.expense;
    const description = req.body.description;
    const category = req.body.category;
    //Expense.create({ amount, description, category, userId: req.user.id })
   req.user.createExpense({amount,description,category})
      .then((data) => {
        res.status(200).json({ newExpense: data });
      })
      .catch((e) => console.log(e));
  }

  exports.getExpense=(req, res, next) => {
    // Expense.findAll({where:{userId:req.user.id}})
    req.user
      .getExpenses()
      .then((data) => {
        res.status(200).json({ expenses: data });
      })
      .catch((e) => console.log(e));
  }

  exports.deleteExpense=(req, res, next) => {
    const expId = req.params.expenseId;
    Expense.destroy({ where: { id: expId ,userId:req.user.id} })
      .then(() => {
        res.status(2000);
      })
      .catch((e) => {
        console.log(e);
      });
  }