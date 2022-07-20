const express = require("express");
const pool = require("../../db.config");

const {
  signUpUser,
  signInUser,
} = require("../../function/handler/userHandler");
const { generateToken } = require("../../function/middleware/tokenGenerator");

const router = express.Router();

router.post("/signUp", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await signUpUser(username, password);

    const token = await generateToken(user);

    return res.status(201).json({ message: "user has been registered", token });
  } catch (error) {
    res.status(409).json({ message: "user already exist" });
  }
});

router.post("/signIn", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await signInUser(username, password);

    const token = await generateToken(user);
    await pool.query(
      `UPDATE credential SET  refresh_token='${token.refresh_token}' WHERE username = '${username}'`
    );

    res.status(200).json({ message: "success", token });
  } catch (error) {
    res.status(401).json({ message: "incorect email/password" });
  }
});

module.exports = router;
