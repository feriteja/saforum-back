const pool = require("../../db.config");

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

module.exports = { addForum, deleteForum };
