const pool = require("../../db.config");

const log_handler = async (username, activity, status, target) => {
  try {
    const forum =
      await pool.query(`INSERT INTO application_log (username, activity, status,target)
     VALUES ('${username}' ,'${activity}','${status}', '${target}' )`);
    return forum.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { log_handler };
