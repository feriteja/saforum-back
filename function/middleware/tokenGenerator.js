const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = async (req, res, next) => {
  try {
    const access_token = await jwt.sign(
      req.body,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20h",
      }
    );
    const refresh_token = await jwt.sign(
      { refresh: true },
      process.env.REFRESH_TOKEN_SECRET
    );

    req.genToken = { access_token, refresh_token };

    next();
  } catch (error) {
    throw error;
  }
};

module.exports = { generateToken };
