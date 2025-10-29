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
    SELECT
      comment_id,
      votes,
      created_at,
      author,
      body,
      article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
    `,
    [article_id]
  );

  return rows;
};
