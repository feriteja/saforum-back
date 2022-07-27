const pool = require("../../db.config");

const getUserDetailByUid = async (userID) => {
  try {
    const user = await pool.query(
      `SELECT * FROM users WHERE uuid = '${userID}'`
    );

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};
const getUserDetailByUsername = async (username) => {
  try {
    const user = await pool.query(
      `SELECT users.*  FROM users WHERE username = '${username}'`
    );

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};

const updateUser = async (userID, data) => {
  try {
    const status = data?.status?.replace(/'/g, "''");
    const alias = data?.alias?.replace(/'/g, "''");
    const userQuery = await pool.query(
      `SELECT * FROM users WHERE uuid = '${userID}'`
    );
    if (userQuery.rowCount === 0) return userQuery.rowCount;
    const user = userQuery.rows[0];

    const res = await pool.query(
      `UPDATE users SET avatar='${data.avatar || user.avatar}', alias='${
        alias || user.alias
      }', status='${status || user.status}' WHERE uuid='${userID}' `
    );

    return res.rowCount;
  } catch (error) {
    throw error;
  }
};
const getUserForum = async (username) => {
  try {
    const forum = await pool.query(`
    SELECT forum.*, jsonb_array_length(comment) AS comment, users.username as owner
    FROM forum 
    INNER JOIN users ON users.uuid = forum.owner
    WHERE username = '${username}' 
    ORDER BY forum.created_at DESC
    `);
    return forum.rows;
  } catch (error) {}
};

//! ADMIN ONLY
const getAllUser = async (username = "") => {
  try {
    const users = await pool.query(
      `SELECT uuid, username, role, alias,avatar, created_at FROM users WHERE username LIKE '%${username}%' `
    );
    return users.rows;
  } catch (error) {
    throw error;
  }
};

//! ADMIN ONLY
const getUserForumNumber = async () => {
  try {
    const res = await pool.query(`SELECT COUNT(DISTINCT f.fuid) as "forumCount",
    COUNT(DISTINCT u.uuid) as "usersCount"
    FROM forum f
    join users u on true ;
    `);
    return res.rows[0];
  } catch (error) {}
};

//! SUPER_ADMIN ONLY
const changeUserRole = async (uuid, role) => {
  try {
    const change = await pool.query(
      `UPDATE users SET role ='${role}'  WHERE uuid = '${uuid}' `
    );
    return change.rowCount;
  } catch (error) {}
};

module.exports = {
  getUserDetailByUid,
  updateUser,
  getAllUser,
  getUserDetailByUsername,
  getUserForum,
  changeUserRole,
  getUserForumNumber,
};
