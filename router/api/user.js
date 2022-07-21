const express = require("express");
const {
  signUpUser,
  signInUser,
  getUserDetail,
} = require("../../function/handler/userHandler");
const router = express.Router();

router.get("/detail", async (req, res) => {
  try {
    const { userID } = req.query;

    const user = await getUserDetail(userID);

    res.json({ message: "user exist", user });
  } catch (error) {
    res.status(404).json({ message: "user not found" });
  }
});

module.exports = router;
