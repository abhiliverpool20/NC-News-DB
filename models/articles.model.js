const db = require("../db/connection");

exports.selectArticles = async () => {
  const query = `
    SELECT
      a.author,
      a.title,
      a.article_id,
      a.topic,
      a.created_at,
      a.votes,
      a.article_img_url,
      COUNT(c.comment_id)::INT AS comment_count
    FROM articles a
    LEFT JOIN comments c
      ON c.article_id = a.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;
  `;
  const { rows } = await db.query(query);
  return rows;
};
