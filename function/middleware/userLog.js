const { log_handler } = require("../handler/logHandler");

const userLog = async (req, res, next) => {
  try {
    const username = req?.user?.username || req.body.username;
    const activity = req.activity || null;
    const status = req.status || null;
    const target = req.target || null;
    return await log_handler(username, activity, status, target);
  } catch (error) {
    throw error;
  }
};

module.exports = { userLog };
