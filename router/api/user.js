const express = require("express");
const {
  signUpUser,
  signInUser,
} = require("../../function/handler/userHandler");
const router = express.Router();

router.post("/user", async (req, res) => {
  res.send("halo");
});

module.exports = router;
