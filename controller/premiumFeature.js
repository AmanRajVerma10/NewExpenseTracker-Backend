const User = require("../model/user");
const Expense = require("../model/expense");
const sequelize = require("../util/database");

exports.getUserLeaderboard = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ["id", "name"] });
    const expenses = await Expense.findAll({
      attributes: [
        "userId",
        [sequelize.fn("sum", sequelize.col('amount')), "totalSum"]
      ],
      group: ["userId"],
    });

    // const aggregatedExpense={};
    // expenses.forEach(exp=>{
    //     if(aggregatedExpense[exp.userId]){
    //         aggregatedExpense[exp.userId]+=exp.amount;
    //     }
    //     aggregatedExpense[exp.userId]=exp.amount;
    // })
    console.log(expenses);
    const retArray = [];
    // users.map((user) => {
    //   retArray.push({
    //     name: user.name,
    //     totalAmount: aggregatedExpense[user.id] || 0,
    //   });
    // });
    // retArray.sort((a, b) => b.totalAmount - a.totalAmount);
    res.status(200).json({ arr:expenses });
  } catch (error) {
    console.log(error);
    res.status(400).json({ err: error });
  }
};
