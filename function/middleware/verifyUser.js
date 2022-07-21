const jwt = require("jsonwebtoken");
const pool = require("../../db.config");
const dotenv = require("dotenv");
dotenv.config();

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    if (!token == null) return res.sendStatus(401);

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const isLogin = await pool.query(
      `SELECT refresh_token FROM credential WHERE username = '${user.username}' `
    );

    if (!isLogin.rows[0].refresh_token) return res.sendStatus(401);

    req.user = user;

    next();
  } catch (error) {
    res.sendStatus(404);
  }
};

module.exports = { verifyUser };
