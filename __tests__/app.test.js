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
  test("200: responds with { articles: [ { author,title,article_id,topic,created_at,votes,article_img_url,comment_count }, ... ] } sorted by created_at desc and without body", async () => {
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
