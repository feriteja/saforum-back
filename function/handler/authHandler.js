const pool = require("../../db.config");
const bcrypt = require("bcrypt");

const signUpUser = async (userName, password) => {
  try {
    const genSalt = await bcrypt.genSalt(10);

    const hashPass = await bcrypt.hash(password, genSalt);

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
    const user = await pool.query(
      `SELECT * FROM credential WHERE username = '${username}'`
    );
    const isUser = await bcrypt.compare(password, user.rows[0].password);

    if (!isUser) throw false;

    return user.rows[0];
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const signOutUser = async (username) => {
  try {
    const res = await pool.query(
      `UPDATE credential SET  refresh_token = null WHERE username = '${username}'`
    );

    return res;
  } catch (error) {
    console.log("errorsignout", error);
    throw error;
  }
};

module.exports = { signUpUser, signInUser, signOutUser };
