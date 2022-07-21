const express = require("express");
const pool = require("../../db.config");

const {
  signUpUser,
  signInUser,
  signOutUser,
} = require("../../function/handler/authHandler");
const { generateToken } = require("../../function/handler/tokenGenerator");
const { verifyUser } = require("../../function/middleware/verifyUser");

const router = express.Router();

router.post("/signUp", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await signUpUser(username, password);

    const token = await generateToken(user);
    await pool.query(
      `UPDATE credential SET  refresh_token='${token.refresh_token}' WHERE username = '${username}'`
    );

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

router.post("/signOut", verifyUser, async (req, res) => {
  try {
    await signOutUser(req.user.username);
    res.sendStatus(204);
  } catch (error) {
    res.status(401).json({ message: "something wrong" });
  }
});

module.exports = router;
