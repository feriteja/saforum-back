const pool = require("../../db.config");
const bcrypt = require("bcrypt");

const signUpUser = async (userName, password) => {
  try {
    const genSalt = await bcrypt.genSalt(10);

    const hashPass = await bcrypt.hash(password, genSalt);

    await pool.query(`INSERT INTO credential (username,password)
    VALUES ('${userName}','${hashPass}')`);

    await pool.query(`INSERT INTO users (username) VALUES ('${userName}') `);

    return true;
  } catch (error) {
    throw error;
  }
};

const signInUser = async (username, password) => {
  try {
    const user = await pool.query(
      `SELECT * FROM credential WHERE username = '${username}'`
    );
    const isLogin = await bcrypt.compare(password, user.rows[0].password);

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { signUpUser, signInUser };
