const express = require("express");
const cors = require("cors");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
} = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteCommentById); // <-- add this
app.get("/api/users", getUsers);

app.use((req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg)
    return res.status(err.status).send({ msg: err.msg });
  if (err.code === "22P02") return res.status(400).send({ msg: "Bad request" });
  if (err.code === "23503" && err.constraint === "comments_author_fkey") {
    return res.status(404).send({ msg: "User not found" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
