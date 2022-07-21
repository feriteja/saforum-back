const pool = require("../../db.config");

const addForum = async (userID, data) => {
  try {
    const res = await pool(
      `INSERT INTO forum (owner, title, content, category) VALUES ('${userID}', '${data.title}','${data.content}','${data.category}' )`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

module.exports = { addForum };
