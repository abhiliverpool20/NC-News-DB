const express = require("express");
const cors = require("cors");
const { getTopics } = require("./controllers/topics.controller");
const { getArticles } = require("./controllers/articles.controller");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

app.use((req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
