const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("200: responds with { topics: [ { slug, description }, ... ] }", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);
    expect(body).toHaveProperty("topics");
    expect(Array.isArray(body.topics)).toBe(true);
    body.topics.forEach((topic) => {
      expect(topic).toEqual(
        expect.objectContaining({
          slug: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with all articles including comment_count, sorted by created_at desc, and no body property", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body).toHaveProperty("articles");
    expect(Array.isArray(body.articles)).toBe(true);
    expect(body.articles.length).toBeGreaterThan(0);

    body.articles.forEach((article) => {
      expect(article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        })
      );
      expect(article).not.toHaveProperty("body");
    });

    expect(body.articles).toBeSortedBy("created_at", { descending: true });
  });
});

describe("GET /api/users", () => {
  test("200: responds with { users: [ { username, name, avatar_url }, ... ] }", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body).toHaveProperty("users");
    expect(Array.isArray(body.users)).toBe(true);
    expect(body.users.length).toBeGreaterThan(0);
    body.users.forEach((user) => {
      expect(user).toEqual(
        expect.objectContaining({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        })
      );
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with { article: {..., comment_count} } including total comments for that article", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    expect(body).toHaveProperty("article");
    expect(body.article).toEqual(
      expect.objectContaining({
        author: expect.any(String),
        title: expect.any(String),
        article_id: 1,
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      })
    );
  });

  test("400: responds with Bad request for invalid article_id", async () => {
    const { body } = await request(app)
      .get("/api/articles/not-a-number")
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });

  test("404: responds with Article not found for valid-but-nonexistent id", async () => {
    const { body } = await request(app).get("/api/articles/9999").expect(404);
    expect(body).toEqual({ msg: "Article not found" });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with { comments: [...] } including required fields, most recent first", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    expect(body).toHaveProperty("comments");
    expect(Array.isArray(body.comments)).toBe(true);
    body.comments.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        })
      );
      expect(comment.article_id).toBe(1);
    });
    expect(body.comments).toBeSortedBy("created_at", { descending: true });
  });

  test("200: responds with { comments: [] } when article exists but has no comments", async () => {
    const { body } = await request(app)
      .get("/api/articles/2/comments")
      .expect(200);
    expect(body).toEqual({ comments: expect.any(Array) });
  });

  test("400: Bad request for invalid article_id", async () => {
    const { body } = await request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });

  test("404: Article not found for valid-but-nonexistent id", async () => {
    const { body } = await request(app)
      .get("/api/articles/9999/comments")
      .expect(404);
    expect(body).toEqual({ msg: "Article not found" });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: inserts a new comment and responds with the posted comment", async () => {
    const newComment = { username: "butter_bridge", body: "Great read!" };
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201);
    expect(body).toHaveProperty("comment");
    expect(body.comment).toEqual(
      expect.objectContaining({
        comment_id: expect.any(Number),
        body: "Great read!",
        author: "butter_bridge",
        article_id: 1,
        votes: expect.any(Number),
        created_at: expect.any(String),
      })
    );
  });

  test("201: ignores extra properties on request body", async () => {
    const newComment = {
      username: "butter_bridge",
      body: "Nice!",
      extra: "ignore-me",
    };
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201);
    expect(body.comment).not.toHaveProperty("extra");
  });

  test("400: Bad request when article_id is invalid", async () => {
    const newComment = { username: "butter_bridge", body: "Oops" };
    const { body } = await request(app)
      .post("/api/articles/not-a-number/comments")
      .send(newComment)
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });

  test("400: Bad request when body is missing", async () => {
    const newComment = { username: "butter_bridge" };
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });

  test("400: Bad request when username is missing", async () => {
    const newComment = { body: "No username here" };
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });

  test("404: Article not found for valid-but-nonexistent id", async () => {
    const newComment = { username: "butter_bridge", body: "Hello" };
    const { body } = await request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404);
    expect(body).toEqual({ msg: "Article not found" });
  });

  test("404: User not found when username does not exist", async () => {
    const newComment = { username: "nonexistent_user", body: "Hi" };
    const { body } = await request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404);
    expect(body).toEqual({ msg: "User not found" });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: increments votes and returns the updated article", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200);
    expect(body.article.votes).toEqual(expect.any(Number));
  });

  test("200: decrements votes and returns the updated article", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -100 })
      .expect(200);
    expect(body.article.votes).toEqual(expect.any(Number));
  });

  test("400: Bad request when inc_votes is missing", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });

  test("400: Bad request when inc_votes is not a number", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "five" })
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });

  test("404: Article not found for valid-but-nonexistent id", async () => {
    const { body } = await request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404);
    expect(body).toEqual({ msg: "Article not found" });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the comment and returns no content", async () => {
    await request(app).delete("/api/comments/1").expect(204);
  });

  test("400: Bad request for invalid comment_id", async () => {
    const { body } = await request(app)
      .delete("/api/comments/not-a-number")
      .expect(400);
    expect(body).toEqual({ msg: "Bad request" });
  });

  test("404: Comment not found for valid-but-nonexistent id", async () => {
    const { body } = await request(app)
      .delete("/api/comments/9999")
      .expect(404);
    expect(body).toEqual({ msg: "Comment not found" });
  });
});
