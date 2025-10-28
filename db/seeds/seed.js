const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("./utils.js");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(
      `
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS articles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS topics;
    `
    )
    .then(() => {
      return db.query(`
        CREATE TABLE topics (
          slug VARCHAR PRIMARY KEY NOT NULL,
          description VARCHAR NOT NULL,
          img_url VARCHAR(1000) NOT NULL
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR PRIMARY KEY NOT NULL,
          name VARCHAR NOT NULL,
          avatar_url VARCHAR(1000) NOT NULL
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          topic VARCHAR NOT NULL REFERENCES topics(slug),
          author VARCHAR NOT NULL REFERENCES users(username),
          body TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          votes INT NOT NULL DEFAULT 0,
          article_img_url VARCHAR(1000) NOT NULL
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT NOT NULL REFERENCES articles(article_id),
          body TEXT NOT NULL,
          votes INT NOT NULL DEFAULT 0,
          author VARCHAR NOT NULL REFERENCES users(username),
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
    })
    .then(() => {
      const topicsArray = topicData.map(({ slug, description, img_url }) => [
        slug,
        description,
        img_url,
      ]);
      const insertTopics = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L;`,
        topicsArray
      );
      return db.query(insertTopics);
    })
    .then(() => {
      const usersArray = userData.map(({ username, name, avatar_url }) => [
        username,
        name,
        avatar_url,
      ]);
      const insertUsers = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L;`,
        usersArray
      );
      return db.query(insertUsers);
    })
    .then(() => {
      const normalizedArticles = articleData.map(convertTimestampToDate);
      const articlesArray = normalizedArticles.map((a) => [
        a.title,
        a.topic,
        a.author,
        a.body,
        a.created_at,
        a.votes,
        a.article_img_url,
      ]);
      const insertArticles = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
         VALUES %L RETURNING *;`,
        articlesArray
      );
      return db.query(insertArticles);
    })
    .then(({ rows }) => {
      const articleLookup = rows.reduce((acc, row) => {
        acc[row.title] = row.article_id;
        return acc;
      }, {});

      const normalizedComments = commentData.map(convertTimestampToDate);
      const commentsArray = normalizedComments.map((c) => [
        articleLookup[c.article_title],
        c.body,
        c.votes,
        c.author,
        c.created_at,
      ]);
      const insertComments = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at)
         VALUES %L;`,
        commentsArray
      );
      return db.query(insertComments);
    });
};

module.exports = seed;
