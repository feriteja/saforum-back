const express = require("express");
const {
  signUpUser,
  signInUser,
  getUserDetail,
  updateUser,
  getAllUser,
} = require("../../function/handler/userHandler");
const {
  verifyUser,
  verifyAdmin,
} = require("../../function/middleware/verifyUser");
const router = express.Router();

//! ADMIN ONLY
router.get("/", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const user = await getAllUser();
    res.status(200).json({ message: "success", data: user });
  } catch (error) {
    res.sendStatus(400);
    throw error;
  }
});

router.put("/", verifyUser, async (req, res) => {
  try {
    const data = req.body;
    const userID = req.user.uuid;

    const isUpdated = await updateUser(userID, data);
    if (isUpdated === 0) return res.sendStatus(404);

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(400);

    throw error;
  }
});

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
