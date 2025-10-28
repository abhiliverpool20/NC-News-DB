CREATE TABLE "topics" (
  "slug" varchar PRIMARY KEY NOT NULL,
  "description" varchar NOT NULL,
  "img_url" varchar(1000) NOT NULL
);

CREATE TABLE "users" (
  "username" varchar PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "avatar_url" varchar(1000) NOT NULL
);

CREATE TABLE "articles" (
  "article_id" serial PRIMARY KEY NOT NULL,
  "title" varchar NOT NULL,
  "topic" varchar NOT NULL,
  "author" varchar NOT NULL,
  "body" text NOT NULL,
  "created_at" datetime NOT NULL DEFAULT (now()),
  "votes" int NOT NULL DEFAULT 0,
  "article_img_url" varchar(1000) NOT NULL
);

CREATE TABLE "comments" (
  "comment_id" serial PRIMARY KEY NOT NULL,
  "article_id" int NOT NULL,
  "body" text NOT NULL,
  "votes" int NOT NULL DEFAULT 0,
  "author" varchar NOT NULL,
  "created_at" datetime NOT NULL DEFAULT (now())
);

ALTER TABLE "articles" ADD FOREIGN KEY ("topic") REFERENCES "topics" ("slug");

ALTER TABLE "articles" ADD FOREIGN KEY ("author") REFERENCES "users" ("username");

ALTER TABLE "comments" ADD FOREIGN KEY ("article_id") REFERENCES "articles" ("article_id");

ALTER TABLE "comments" ADD FOREIGN KEY ("author") REFERENCES "users" ("username");

