const User = require("../model/user");
const bcrypt= require('bcrypt')
const jwt=require('jsonwebtoken')

function generateAccessToken(id, name,ispremiumuser) {
    return jwt.sign({ userId: id, name, ispremiumuser }, "secretkey10");
  }

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
          token: generateAccessToken(user.id, user.name, user.ispremiumuser),
        });
      }
      if (result === false) {
        res.status(200).json({ success: false, message: "Invalid password" });
      }
    });
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};
