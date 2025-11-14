
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
