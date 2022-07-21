const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    if (!token == null) return res.sendStatus(401);

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = user;

    next();
  } catch (error) {
    throw error;
  }
};

module.exports = { verifyUser };
