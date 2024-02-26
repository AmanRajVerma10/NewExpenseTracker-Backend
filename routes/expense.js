const express = require("express");

const expenseController = require("../controller/expense");
const Authenticate = require("../middleware/auth");
const router = express.Router();

router.get("/get-expense", Authenticate, expenseController.getExpense);

router.post("/add-expense", Authenticate, expenseController.addExpense);

router.delete("/delete-expense/:expenseId", Authenticate, expenseController.deleteExpense);

module.exports = router;
