const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = async (data) => {
  try {
    const access_token = await jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20h",
    });
    const refresh_token = await jwt.sign(
      { refresh: true },
      process.env.REFRESH_TOKEN_SECRET
    );

    return { access_token, refresh_token };
  } catch (error) {
    throw error;
  }
};

module.exports = { generateToken };
