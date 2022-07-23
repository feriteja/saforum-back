const pool = require("../../db.config");

const getAllForums = async (category) => {
  try {
    if (category) {
      const forum = await pool.query(
        `SELECT fuid, title, content,  users.username AS owner, forum.created_at, category, like_count, jsonb_array_length(comment) AS comment
        FROM users
        JOIN forum ON  forum.owner=users.uuid 
        WHERE category = '${category}'
        ORDER BY forum.created_at DESC
        `
      );
      return forum.rows;
    }

    const forum = await pool.query(
      `SELECT fuid, title, content,  users.username AS owner, forum.created_at, category, like_count, jsonb_array_length(comment) AS comment
      FROM users
      JOIN forum ON  forum.owner=users.uuid 
      ORDER BY forum.created_at DESC`
    );

    return forum.rows;
  } catch (error) {
    throw error;
  }
};

const getForumDetail = async (forumID) => {
  try {
    const forum = await pool.query(
      `SELECT *, (SELECT   JSON_AGG(
              JSON_BUILD_OBJECT('id', e.cmt->>'id',
                                'user',e.cmt->>'user',
                                'username', u.username,
                                'avatar', u.avatar,
                                'alias', u.alias,
                                'comment', e.cmt->>'comment',
                                'created_at', e.cmt->>'created_at'
                               )
          ) AS comment
          FROM forum f
          INNER JOIN LATERAL JSONB_ARRAY_ELEMENTS(f.comment) AS e(cmt) ON TRUE
          INNER JOIN users u ON (cmt->>'user')::text = u.uuid::text
          WHERE fuid = '${forumID}')
      FROM forum
      WHERE fuid = '${forumID}'`
    );

    return forum.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addForum = async (userID, data) => {
  try {
    const content = data.content.replace(/'/g, "''");
    const title = data.title.replace(/'/g, "''");
    const res = await pool.query(
      `INSERT INTO forum (owner, title, content, category) VALUES ('${userID}', '${title}','${content}','${data.category}' )`
    );
    return true;
  } catch (error) {
    throw error;
  }
};

const deleteForum = async (forumID) => {
  try {
    const res = await pool.query(`DELETE FROM forum WHERE fuid='${forumID}'`);
    if (res.rowCount === 0) return false;
    return true;
  } catch (error) {
    throw error;
  }
};

const updateForum = async (data) => {
  try {
    const res = await pool.query(
      `UPDATE forum SET title='${data.title}', content='${data.content}'   WHERE fuid = '${data.forumID}' `
    );
    console.log(res);
    return res.rowCount;
  } catch (error) {
    console.log("error update", error);
    throw error;
  }
};

const commentForum = async (data, forumID) => {
  try {
    const res = await pool.query(
      `UPDATE forum SET comment= COALESCE(comment,'[]'::jsonb)|| '${data}'::jsonb  WHERE fuid = '${forumID}' `
    );

    console.log(res);

    return res.rowCount;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  addForum,
  deleteForum,
  getAllForums,
  getForumDetail,
  updateForum,
  commentForum,
};
