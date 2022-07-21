const express = require("express");
const {
  addForum,
  deleteForum,
  getAllForums,
  getForumDetail,
  updateForum,
} = require("../../function/handler/forumHandler");

const { verifyUser } = require("../../function/middleware/verifyUser");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const forums = await getAllForums();

    return res.status(200).json({ message: "success", data: forums });
  } catch (error) {
    res.sendStatus(404);
    throw error;
  }
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

router.put("/update", verifyUser, async (req, res) => {
  try {
    const data = req.body;

    const isUpdate = await updateForum(data);

    if (isUpdate === 0) return res.sendStatus(410);

    res.status(200).json({ message: "forum update success" });
  } catch (error) {
    res.status(400).json({ message: "failed to update forum" });
    throw error;
  }
});

module.exports = router;
