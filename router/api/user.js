const express = require("express");
const {
  signUpUser,
  signInUser,
} = require("../../function/handler/userHandler");
const router = express.Router();

router.post("/signUp", async (req, res) => {
  try {
    const { username, password } = req.body;

    await signUpUser(username, password);
    res.status(200).json({ message: "user has been registered" });
  } catch (error) {
    res.status(409).json({ message: "user already exist" });
  }
});

router.post("/signIn", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await signInUser(username, password);
    res.status(200).send({ message: "success", user });
  } catch (error) {
    res.status(401).json({ message: "incorect email/password" });
  }
});

module.exports = router;
