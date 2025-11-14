# **NC News API**

A RESTful backend service created to support a Reddit-style news application. It exposes endpoints that allow clients to fetch topics, articles, users, and comments, as well as create, update, and delete comment and vote data.  
The project is built using **Node.js**, **Express**, and **PostgreSQL**, with deployment handled through **Render**.

---

## 🌐 **Live API**

You can access the deployed API here:

👉 **https://nc-news-api-ktmb.onrender.com/api**

Example endpoint:

👉 **https://nc-news-api-ktmb.onrender.com/api/topics**

---

## 📁 **GitHub Repository**

👉 **https://github.com/abhiliverpool20/NC-News-DB**

---

## 📌 **Project Overview**

This backend replicates core features of a news platform by offering structured and well-tested API endpoints. It provides:

- Retrieval of topics, articles, users, and comments  
- Posting comments on specific articles  
- Updating article vote counts  
- Removing individual comments  
- Sorting and filtering articles by date, topic, votes, and comment_count  

The data layer uses **PostgreSQL**, accessed via **node-postgres (pg)**.  
The test suite is written using **Jest** and **Supertest**, ensuring reliable endpoint behaviour and error handling.

---

## ✅ **Minimum Requirements**

| Technology  | Version |
|-------------|---------|
| **Node.js** | v18+    |
| **PostgreSQL** | v12+ |

---

## ⚙️ **Local Setup Instructions**

### **1. Clone the repository**
```bash
git clone https://github.com/abhiliverpool20/NC-News-DB.git
cd NC-News-DB

2. Install dependencies
npm install

🔑 Environment Variables

Create the following environment files in the project root:

.env.development
PGDATABASE=nc_news

.env.test
PGDATABASE=nc_news_test


✔️ Ensure these files are listed in .gitignore

🗄️ Database Setup
1. Create local databases
npm run setup-dbs

2. Seed the development database
npm run seed

🧪 Testing

Run all test suites:

npm test


Run seed-only tests:

npm run test-seed

🌍 Production Hosting

Hosting stack:

Backend: Render

Database: PostgreSQL

To seed the production database:

npm run seed-prod

🚀 Run the Server Locally
npm start


The server will run at:

👉 http://localhost:9090/api

📚 API Endpoints
Method	Endpoint	Description
GET	/api	Returns a list of all available endpoints
GET	/api/topics	Fetch all topics
GET	/api/articles	Retrieve all articles (sorting & filtering supported)
GET	/api/articles/:article_id	Get a specific article including comment_count
GET	/api/articles/:article_id/comments	Retrieve comments for an article
POST	/api/articles/:article_id/comments	Post a new comment
PATCH	/api/articles/:article_id	Update an article’s vote count
DELETE	/api/comments/:comment_id	Delete a comment
🧑‍💻 Author

Developed by Abhishek Sharma
GitHub: https://github.com/abhiliverpool20
