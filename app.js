const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const Expense = require("./model/expense");
const User = require("./model/user");
const Order = require("./model/order");
const ForgotPassword = require("./model/forgotpassword");
const filesdownloaded = require("./model/filesdownloaded");

const sequelize = require("./util/database");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const premiumFeatureRoutes = require("./routes/premiumFeature");
const resetPasswordRoutes = require("./routes/resetpassword");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));
app.use(cors());
//app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", "data:", "blob:"],
//       fontSrc: ["'self'", "https:", "data:"],
//       scriptSrc: ["'self'", "unsafe-inline"],
//       scriptSrc: ["'self'", "https://*.cloudflare.com"],
//       scriptSrcElem: ["'self'", "https:", "https://*.cloudflare.com"],
//       styleSrc: ["'self'", "https:", "unsafe-inline"],
//       connectSrc: ["'self'", "data", "https://*.cloudflare.com"],
//     },
//   })
// );
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         "https://13.233.110.83:3000/",
//         "https://cdnjs.cloudflare.com",
//       ],
//     },
//   })
// );

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumFeatureRoutes);
app.use(resetPasswordRoutes);

app.use((req, res, next) => {
  console.log("urlll", req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);
User.hasMany(filesdownloaded);
filesdownloaded.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((e) => console.log(e));
