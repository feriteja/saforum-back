const express = require("express");
const {
  addForum,
  deleteForum,
} = require("../../function/handler/forumHandler");

const { verifyUser } = require("../../function/middleware/verifyUser");
const router = express.Router();

router.post("/add", verifyUser, async (req, res) => {
  try {
    const userID = req.user.uuid;

    const data = req.body;

    await addForum(userID, data);

    res.status(201).json({ message: "forum created" });
  } catch (error) {
    res.sendStatus(403);
    throw error;
  }
});

router.delete("/delete", verifyUser, async (req, res) => {
  try {
    const forumID = req.body.forumID;

    const isDeleted = await deleteForum(forumID);
    if (!isDeleted)
      return res
        .status(410)
        .json({ message: "forum not found or has been deleted" });

    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(404);
    throw error;
  }
});

module.exports = router;
