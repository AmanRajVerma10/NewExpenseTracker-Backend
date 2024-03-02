const jwt=require('jsonwebtoken')

const User=require('../model/user')

const Authenticate = async (req, res, next) => {
    try {
      const token = req.header("authorization");
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const authenticatedUser = await User.findByPk(user.userId);
      req.user = authenticatedUser;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false });
    }
  };

  module.exports=Authenticate;
  