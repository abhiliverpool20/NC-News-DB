const {
  selectArticles,
  selectArticleById,
  updateArticleVotes,
} = require("../models/articles.model");

exports.getArticles = async (req, res, next) => {
  try {
    const { sort_by, order, topic } = req.query;
    const articles = await selectArticles({ sort_by, order, topic });
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleVotes = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (inc_votes === undefined || typeof inc_votes !== "number") {
      return res.status(400).send({ msg: "Bad request" });
    }

    const article = await updateArticleVotes(article_id, inc_votes);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
