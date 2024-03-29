const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const filesdownloaded = require("../model/filesdownloaded");

function generateAccessToken(id, name, ispremiumuser, totalexpense) {
  return jwt.sign({ userId: id, name, ispremiumuser, totalexpense }, process.env.JWT_SECRET_KEY);
}

exports.getFiles = async (req, res, next) => {
  try {
    const files = await filesdownloaded.findAll({
      where: { userId: req.user.id },
    });
    if (files) {
      return res.status(200).json({ files });
    }
    throw new Error("No files found!");
  } catch (error) {
   return res.status(500).json({ error: error.message });
  }
};

exports.signUp = async (req, res, next) => {
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
};

exports.login = async (req, res, next) => {
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
          token: generateAccessToken(user.id, user.name, user.ispremiumuser, user.totalexpense),
        });
      }
      if (result === false) {
        res.status(400).json({ success: false, message: "Invalid password" });
      }
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};
