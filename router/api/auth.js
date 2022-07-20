const express = require("express");

const {
  signUpUser,
  signInUser,
} = require("../../function/handler/userHandler");
const { generateToken } = require("../../function/middleware/tokenGenerator");

const router = express.Router();

router.post("/signUp", generateToken, async (req, res) => {
  try {
    const { username, password } = req.body;

    await signUpUser(username, password);

    return res
      .status(201)
      .json({ message: "user has been registered", token: req.genToken });
  } catch (error) {
    res.status(409).json({ message: "user already exist" });
  }
});

router.post("/signIn", generateToken, async (req, res) => {
  try {
    const { username, password } = req.body;
    const refresh_token = req.genToken.refresh_token;
    const user = await signInUser(username, password, refresh_token);
    res.status(200).send({ message: "success", token: req.genToken });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "incorect email/password" });
  }
});

module.exports = router;
