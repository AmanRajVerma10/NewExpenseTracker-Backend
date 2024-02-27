const UUID = require("uuid");
const bcrypt = require("bcrypt");
const Brevo = require("sib-api-v3-sdk");
require("dotenv").config();

const User = require("../model/user");
const ForgotPassword = require("../model/forgotpassword");

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      const id = UUID.v4();
      await ForgotPassword.create({ id, isactive: true, userId: user.id });
      const client = Brevo.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.BREVO_API_KEY;
      const tranEmailApi = new Brevo.TransactionalEmailsApi();
      const sender = { email: "verma.aman464@gmail.com" };
      const receivers = [{ email }];
      const data = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "This is a test",
        htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        textContent: "Hello from node.js",
      });
      console.log(data);
      res.status(200).json(data);
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    res.status(400).json({ err: error });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const id = req.params.id;
    const forgotRequest = await ForgotPassword.findOne({ where: { id } });
    if (forgotRequest) {
      if (!forgotRequest.isactive) {
        throw new Error("Is not active");
      }
      if (forgotRequest.isactive) {
        res.status(200).send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>

            <form action="/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New Password</label>
                <input name="newpassword" type="password" required></input>
                <button>Reset Password</button>
            </form>
        </html>`);
        res.end();
        await forgotRequest.update({ isactive: false });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;
    const forgotRequest = await ForgotPassword.findOne({ where: { id:resetpasswordid } });
    const uid = forgotRequest.userId;
    const user = await User.findOne({ where: { id: uid } });
    bcrypt.hash(newpassword, 10, async (err, hash) => {
      try {
        console.log(err);
        await user.update({ password:hash });
        res.status(201).json({ message: "Password updated!" });
      } catch (e) {
        res.status(400).json(e);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
