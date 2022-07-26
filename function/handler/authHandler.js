const pool = require("../../db.config");
const bcrypt = require("bcrypt");

const signUpUser = async (userName, password) => {
  try {
    const genSalt = await bcrypt.genSalt(10);

    const hashPass = await bcrypt.hash(password, genSalt);
    userName.replace(/'/g, "''");

    await pool.query(`INSERT INTO credential (username,password)
    VALUES ('${userName}','${hashPass}')`);

    await pool.query(`INSERT INTO users (username) VALUES ('${userName}') `);

    const user = await pool.query(
      `SELECT * FROM users WHERE username = '${userName}'`
    );

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};

const signInUser = async (username, password) => {
  try {
    username.replace(/'/g, "''");
    const userCred = await pool.query(
      `SELECT * FROM credential WHERE username = '${username}'`
    );
    if (userCred.rowCount === 0) return false;
    const isUser = await bcrypt.compare(password, userCred.rows[0].password);

    if (!isUser) {
      return false;
    }

    const user = await pool.query(
      `SELECT * FROM users WHERE username = '${username}'`
    );

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};

const signOutUser = async (username) => {
  try {
    username.replace(/'/g, "''");

    const res = await pool.query(
      `UPDATE credential SET  refresh_token = null WHERE username = '${username}'`
    );

    return res;
  } catch (error) {
    throw error;
  }
};

module.exports = { signUpUser, signInUser, signOutUser };
