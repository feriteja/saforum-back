const express = require("express");
const {
  updateUser,
  getAllUser,
  getUserDetailByUid,
  getUserDetailByUsername,
  getUserForum,
} = require("../../function/handler/userHandler");
const { upload } = require("../../function/middleware/multer");
const {
  verifyUser,
  verifyAdmin,
} = require("../../function/middleware/verifyUser");
const fs = require("fs");
const { deleteFile, moveFile } = require("../../function/utils/fileHandler");
const { userLog } = require("../../function/middleware/userLog");

const router = express.Router();

//! ADMIN ONLY get all user
router.get("/", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const user = await getAllUser();
    res.status(200).json({ message: "success", data: user });
  } catch (error) {
    res.sendStatus(400);
    throw error;
  }
});

router.put(
  "/",
  upload.single("avatar"),
  verifyUser,
  async (req, res, next) => {
    try {
      const file = req.file;

      const body = req.body;
      const userID = req.user.uuid;
      body.avatar = file && file.filename;

      const isUpdated = await updateUser(userID, body);
      if (isUpdated === 0) {
        deleteFile(file.path);
        return res.sendStatus(400);
      }
      req.activity = "edit profile";
      req.status = "success";
      req.target = req.user.uuid;
      res.sendStatus(204);
      next();
    } catch (error) {
      req.activity = "edit profile";
      req.status = "failed";
      req.target = req.user.uuid;
      res.sendStatus(400);
      next();

      throw error;
    }
  },
  userLog
);

router.get("/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const forum = await getUserForum(username);
    return res.status(200).json({ message: "success", data: forum });
  } catch (error) {
    throw error;
  }
});

router.get("/detail/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const user = await getUserDetailByUsername(username);

    const forum = await getUserForum(username);

    if (!user) return res.status(404).json({ message: "user not found" });

    return res.status(200).json({ message: "user exist", user });
  } catch (error) {
    res.status(404).json({ message: "user not found" });
    throw error;
  }
});

module.exports = router;
