const express = require("express");

const premiumFeatureController = require("../controller/premiumFeature");
const Authenticate = require("../middleware/auth");

const router = express.Router();

router.get(
  "/premium/getleaderboard",
  Authenticate,
  premiumFeatureController.getUserLeaderboard
);

module.exports=router;