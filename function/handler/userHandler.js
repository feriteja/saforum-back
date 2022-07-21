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

const updateUser = async (userID, data) => {
  try {
    const userQuery = await pool.query(
      `SELECT * FROM users WHERE uuid = '${userID}'`
    );
    if (userQuery.rowCount === 0) return userQuery.rowCount;
    const user = userQuery.rows[0];

    const res = await pool.query(
      `UPDATE users SET avatar='${data.avatar || user.avatar}', alias='${
        data.alias || user.alias
      }', status='${data.status || user.status}' WHERE uuid='${userID}' `
    );

    return res.rowCount;
  } catch (error) {
    throw error;
  }
};

//! ADMIN ONLY
const getAllUser = async () => {
  try {
    const users = await pool.query(
      `SELECT uuid, username, role, alias,avatar, created_at FROM users`
    );
    return users.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { getUserDetail, updateUser, getAllUser };
