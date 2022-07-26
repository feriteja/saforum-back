const express = require("express");
const pool = require("../../db.config");

const {
  signUpUser,
  signInUser,
  signOutUser,
} = require("../../function/handler/authHandler");
const { generateToken } = require("../../function/handler/tokenGenerator");
const { userLog } = require("../../function/middleware/userLog");
const { verifyUser } = require("../../function/middleware/verifyUser");

const router = express.Router();

router.post(
  "/signUp",
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await signUpUser(username, password);

      const token = await generateToken(user);
      await pool.query(
        `UPDATE credential SET  refresh_token='${token.refresh_token}' WHERE username = '${username}'`
      );

      res.status(201).json({ message: "user has been registered", token });
      req.activity = "signup";
      req.status = "success";
      next();
    } catch (error) {
      req.activity = "signup";
      req.status = "success";
      res.status(409).json({ message: "user already exist" });
      next();
      throw error;
    }
  },
  userLog
);

router.post(
  "/signIn",
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await signInUser(username, password);
      if (!user) {
        req.activity = "signin";
        req.status = "failed";
        res.status(401).json({ message: "incorect email/password" });
        next();
        return;
      }

      const token = await generateToken(user);
      await pool.query(
        `UPDATE credential SET  refresh_token='${token.refresh_token}' WHERE username = '${username}'`
      );

      req.activity = "signin";
      req.status = "success";
      res.status(200).json({ message: "success", token });
      next();
    } catch (error) {
      req.activity = "signin";
      req.status = "failed";
      res.status(401).json({ message: "incorect email/password" });

      throw error;
    }
  },
  userLog
);

router.post(
  "/signOut",
  verifyUser,
  async (req, res, next) => {
    try {
      await signOutUser(req.user.username);
      res.sendStatus(204);
      req.activity = "signout";
      req.status = "success";
      next();
    } catch (error) {
      req.activity = "signup";
      req.status = "failed";
      res.status(403).json({ message: "something wrong" });
      next();
      throw error;
    }
  },
  userLog
);

module.exports = router;
