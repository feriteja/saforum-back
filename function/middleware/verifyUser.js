const jwt = require("jsonwebtoken");
const pool = require("../../db.config");
const dotenv = require("dotenv");
dotenv.config();

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const refreshToken = req.body.refresh_token;

    const token = authHeader && authHeader.split(" ")[1];
    if (!token == null) return res.sendStatus(401);

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const isLogin = await pool.query(
      `SELECT refresh_token FROM credential WHERE username = '${user.username}' `
    );

    const isLoginValid = isLogin.rows[0].refresh_token === refreshToken;

    if (!isLoginValid) return res.sendStatus(401);

    req.user = user;

    next();

    return;
  } catch (error) {
    res.sendStatus(401);
    throw error;
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "ADMIN";
    if (!isAdmin) return res.status(401).json({ message: "you are not admin" });
    next();
  } catch (error) {
    res.sendStatus(400);
    throw error;
  }
};

module.exports = { verifyUser, verifyAdmin };
