const { json } = require("express");
const express = require("express");
const pool = require("../../db.config");
const {
  addForum,
  deleteForum,
  getAllForums,
  getForumDetail,
  updateForum,
  commentForum,
  addLikeToForum,
  removeLikeToForum,
} = require("../../function/handler/forumHandler");
const { upload } = require("../../function/middleware/multer");
const { userLog } = require("../../function/middleware/userLog");

const { verifyUser } = require("../../function/middleware/verifyUser");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    const forums = await getAllForums(category);

    res.status(200).json({ message: "success", data: forums });

    return;
  } catch (error) {
    res.sendStatus(404);
    throw error;
  }
});

router.get("/popular", async (req, res) => {
  try {
  } catch (error) {}
});

router.get("/s/:forumID", async (req, res) => {
  try {
    const forumID = req.params.forumID;

    const forum = await getForumDetail(forumID);

    return res.status(200).json({ message: "success", data: forum });
  } catch (error) {
    res.sendStatus(404);
  }
});

router.post("/like", verifyUser, async (req, res, next) => {
  try {
    const { forumID } = req.body;
    const { uuid: userID } = req.user;
    const isLike = await addLikeToForum(forumID, userID);
    if (isLike === 0) {
      req.activity = "like forum";
      req.status = "failed";
      req.target = forumID;
      res.sendStatus(400);
      next();
      return;
    }
    req.activity = "like forum";
    req.status = "success";
    req.target = forumID;
    res.sendStatus(204);
    next();
  } catch (error) {
    req.activity = "like forum";
    req.status = "failed";
    req.target = req.body.forumID;
    res.sendStatus(400);
    throw error;
  }
});
router.post("/nolike", verifyUser, async (req, res, next) => {
  try {
    const { forumID } = req.body;
    const { uuid: userID } = req.user;
    const isLike = await removeLikeToForum(forumID, userID);
    if (isLike === 0) {
      req.activity = "remove like forum";
      req.status = "failed";
      req.target = forumID;
      res.sendStatus(400);
      next();
      return;
    }
    req.activity = "like forum";
    req.status = "success";
    req.target = forumID;
    res.sendStatus(204);
    next();
  } catch (error) {
    req.activity = "like forum";
    req.status = "failed";
    req.target = req.body.forumID;
    res.sendStatus(400);
    throw error;
  }
});

router.post(
  "/add",
  upload.single("banner"),
  verifyUser,
  async (req, res, next) => {
    try {
      const userID = req.user.uuid;
      const file = req.file;

      const data = req.body;
      data.banner = file && file.filename;

      const isAdded = await addForum(userID, data);
      if (isAdded === 0) {
        deleteFile(file.path);
        res.sendStatus(400);
      }
      req.activity = "post forum";
      req.status = "success";

      res.status(201).json({ message: "forum created" });
      next();
    } catch (error) {
      res.sendStatus(403);
      req.activity = "post forum";
      req.status = "failed";
      throw error;
    }
  },
  userLog
);

router.delete(
  "/delete",
  verifyUser,
  async (req, res, next) => {
    try {
      console.log("masuk");
      const forumID = req.body.forumID;

      const isDeleted = await deleteForum(forumID);
      if (!isDeleted)
        return res
          .status(410)
          .json({ message: "forum not found or has been deleted" });

      res.sendStatus(204);
      req.activity = "delete forum";
      req.status = "success";
      req.target = forumID;
      next();
    } catch (error) {
      res.sendStatus(404);
      req.activity = "delete forum";
      req.status = "failed";
      next();
      throw error;
    }
  },
  userLog
);

router.put(
  "/update",
  upload.single("banner"),
  verifyUser,
  async (req, res, next) => {
    try {
      const file = req.file;

      const data = req.body;

      data.banner = file && file.filename;

      const isUpdate = await updateForum(data.forumID, data);

      if (isUpdate === 0) return res.sendStatus(410);

      res.status(200).json({ message: "forum update success" });
      req.activity = "update forum";
      req.status = "success";
      req.target = data.forumID;
      next();
    } catch (error) {
      res.status(400).json({ message: "failed to update forum" });
      req.activity = "update forum";
      req.status = "failed";
      req.target = req.body.forumID;
      next();
      throw error;
    }
  }
);

router.patch(
  "/comment",
  verifyUser,
  async (req, res, next) => {
    try {
      const body = req.body;
      const date = new Date();

      const user = req.user.uuid;
      const comment = body.comment.replace(/'/g, ` `);

      const data = JSON.stringify({
        id: user.slice(0, 8) + date.toLocaleTimeString() + comment.slice(2, 3),
        user: user,
        comment: comment,
        created_at: date,
      });

      const isComment = await commentForum(data, body.forumID);
      if (isComment === 0) res.sendStatus(410);

      res.sendStatus(201);
      req.activity = "comment forum";
      req.status = "success";
      req.target = body.forumID;
      next();
    } catch (error) {
      req.activity = "comment forum";
      req.status = "failed";
      req.target = body.forumID;
      res.sendStatus(403);
      next();
      throw error;
    }
  },
  userLog
);

module.exports = router;
