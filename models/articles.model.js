const db = require("../db/connection");

exports.selectArticles = async ({ sort_by, order, topic } = {}) => {
  const validSortColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const sortCol = sort_by ? sort_by : "created_at";
  const ord = order ? order.toLowerCase() : "desc";

  if (!validSortColumns.includes(sortCol)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!["asc", "desc"].includes(ord)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  const orderByExpr =
    sortCol === "comment_count" ? "comment_count" : `a.${sortCol}`;

  const values = [];
  const whereClauses = [];

  if (topic) {
    values.push(topic);
    whereClauses.push(`a.topic = $${values.length}`);
  }

  const whereSQL = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

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
    ${whereSQL}
    GROUP BY a.article_id
    ORDER BY ${orderByExpr} ${ord.toUpperCase()};
  `;

  const { rows } = await db.query(query, values);

  if (topic && rows.length === 0) {
    const topicCheck = await db.query(`SELECT 1 FROM topics WHERE slug = $1;`, [
      topic,
    ]);
    if (topicCheck.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
  }

  return rows;
};

exports.selectArticleById = async (article_id) => {
  const { rows } = await db.query(
    `
    SELECT
      a.author,
      a.title,
      a.article_id,
      a.body,
      a.topic,
      a.created_at,
      a.votes,
      a.article_img_url,
      COUNT(c.comment_id)::INT AS comment_count
    FROM articles a
    LEFT JOIN comments c
      ON c.article_id = a.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id;
    `,
    [article_id]
  );

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }

  return rows[0];
};

exports.updateArticleVotes = async (article_id, inc_votes) => {
  const { rows } = await db.query(
    `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING author, title, article_id, body, topic, created_at, votes, article_img_url;
    `,
    [inc_votes, article_id]
  );

  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Article not found" });
  }

  return rows[0];
};
