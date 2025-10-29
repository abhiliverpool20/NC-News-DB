const db = require("../db/connection");

exports.selectCommentsByArticleId = async (article_id) => {
  const articleCheck = await db.query(
    `SELECT 1 FROM articles WHERE article_id = $1;`,
    [article_id]
  );
  if (articleCheck.rowCount === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }

  const { rows } = await db.query(
    `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
    [article_id]
  );

  return rows;
};

exports.insertCommentByArticleId = async (article_id, username, body) => {
  const articleCheck = await db.query(
    `SELECT 1 FROM articles WHERE article_id = $1;`,
    [article_id]
  );
  if (articleCheck.rowCount === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }

  const { rows } = await db.query(
    `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING comment_id, body, author, article_id, votes, created_at;
    `,
    [username, body, article_id]
  );

  return rows[0];
};

exports.removeCommentById = async (comment_id) => {
  const result = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING comment_id;`,
    [comment_id]
  );

  if (result.rowCount === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }

  return;
};
