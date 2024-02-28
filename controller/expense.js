const AWS = require("aws-sdk");
require("dotenv").config();

const Expense = require("../model/expense");
const User = require("../model/user");
const sequelize = require("../util/database");
const filesdownloaded = require("../model/filesdownloaded");

function uploadToS3(data, filename) {
  let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_ACCESS_KEY,
    secretAccessKey: process.env.IAM_SECRET_KEY,
  });

  var params = {
    Bucket: "myexpensetracker10",
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        console.log("Success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}

exports.downloadExpense = async (req, res) => {
  try {
    if(!req.user.ispremiumuser){
      throw new Error("Unauthorized")
    }
    const expenses = await req.user.getExpenses();
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${req.user.id}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExpenses, filename);
    const data= await filesdownloaded.create({fileurl:fileURL,userId:req.user.id})
    res.status(201).json({ fileURL, success: true });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error:error.message, success: false, fileURL: "" });
  }
};

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
