const express = require("express");
const {
  updateUser,
  getAllUser,
  getUserDetailByUid,
  getUserDetailByUsername,
  getUserForum,
  changeUserRole,
  getUserForumNumber,
  getAppLog,
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
    const username = req.query.username;

    const user = await getAllUser(username);
    res.status(200).json({ message: "success", data: user });
  } catch (error) {
    res.sendStatus(400);
    throw error;
  }
});

//! SUPERADMIN ONLY change user role
router.patch(
  "/role",
  verifyUser,
  verifyAdmin,
  async (req, res, next) => {
    try {
      if (req.user.role !== "superadmin") return res.sendStatus(401);

      const { uuid, role } = req.body;
      const user = await changeUserRole(uuid, role);
      if (user === 0) return res.sendStatus(404);

      req.activity = "edit role";
      req.status = "success";
      req.target = uuid;
      res.sendStatus(204);
      next();
    } catch (error) {
      req.activity = "edit role";
      req.status = "failed";
      req.target = req.body.uuid;
      next();
      throw error;
    }
  },
  userLog
);

//! ADMIN ONLY get number of users and forum
router.get("/userforum", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const numberUserNForum = await getUserForumNumber();
    return res.status(200).json({ message: "success", data: numberUserNForum });
  } catch (error) {
    res.sendStatus(400);
    throw error;
  }
});

router.get("/applog", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const log = await getAppLog();

    return res.status(200).json({ message: "success", data: log });
  } catch (error) {
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
