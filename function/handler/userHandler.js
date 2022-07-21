const pool = require("../../db.config");

const getUserDetail = async (userID) => {
  try {
    const user = await pool.query(
      `SELECT * FROM users WHERE uuid = '${userID}'`
    );

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserDetail };
