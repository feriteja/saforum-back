const express = require("express");
const { addForum } = require("../../function/handler/forumHandler");
const {
  signUpUser,
  signInUser,
  getUserDetail,
} = require("../../function/handler/userHandler");
const { verifyUser } = require("../../function/middleware/verifyUser");
const router = express.Router();

router.get("/add", verifyUser, async (req, res) => {
  try {
    const userID = req.user.uuid;
    const data = req.body;

    const forum = await addForum(userID, body);
    console.log(forum);

    res.sendStatus(201);
    // res.json({ message: "user exist", user });
  } catch (error) {
    res.status(404).json({ message: "user not found" });
  }
});

module.exports = router;
