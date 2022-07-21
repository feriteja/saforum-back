const pool = require("../../db.config");

const getAllForums = async () => {
  try {
    const forum = await pool.query(
      `SELECT fuid, title, content, owner, created_at, category, like_count FROM forum`
    );

    return forum.rows;
  } catch (error) {
    throw error;
  }
};

const getForumDetail = async (forumID) => {
  try {
    const forum = await pool.query(
      `SELECT * FROM forum WHERE fuid = '${forumID}'`
    );

    return forum.rows[0];
  } catch (error) {
    throw error;
  }
};

const addForum = async (userID, data) => {
  try {
    const content = data.content.replace(/'/g, "''");
    const res = await pool.query(
      `INSERT INTO forum (owner, title, content, category) VALUES ('${userID}', '${data.title}','${content}','${data.category}' )`
    );
    return true;
  } catch (error) {
    throw error;
  }
};

const deleteForum = async (forumID) => {
  try {
    const res = await pool.query(`DELETE FROM forum WHERE fuid='${forumID}'`);
    if (res.rowCount === 0) return false;
    return true;
  } catch (error) {
    throw error;
  }
};

const updateForum = async (data) => {
  try {
    const res = await pool.query(
      `UPDATE forum SET title='${data.title}', content='${data.content}'   WHERE fuid = '${data.forumID}' `
    );
    console.log(res);
    return res.rowCount;
  } catch (error) {
    console.log("error update", error);
    throw error;
  }
};

module.exports = {
  addForum,
  deleteForum,
  getAllForums,
  getForumDetail,
  updateForum,
};
