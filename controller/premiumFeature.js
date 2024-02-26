const User = require("../model/user");
const Expense = require("../model/expense");
const sequelize = require("../util/database");

exports.getUserLeaderboard = async (req, res, next) => {
  try {
    // const users = await User.findAll({
    //   attributes: [
    //     "id",
    //     "name",
    //     [sequelize.fn("sum", sequelize.col("amount")), "totalSum"],
    //   ],
    //   include: [{ model: Expense, attributes: [] }],
    //   group: ["id"],
    //   order: [["totalSum", "DESC"]],
    // });
    const users= await User.findAll({order:[['totalexpense','DESC']]})

    res.status(200).json({ arr: users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ err: error });
  }
};
