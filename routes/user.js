const express = require("express");

const Authenticate= require('../middleware/auth')

const router = express.Router();
const userController = require("../controller/user");
const expenseController= require('../controller/expense')

router.post("/sign-up", userController.signUp);

router.post("/login", userController.login);

router.get("/download",Authenticate, expenseController.downloadExpense);

module.exports = router;
