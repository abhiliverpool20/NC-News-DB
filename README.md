# NC News Seeding

To connect to your databases locally, you’ll need to configure environment files:

In the main directory of the repository, create two files — one for the development database and one for the test database.

Name the files:

.env.development

.env.test

Add the following lines inside each file:

In .env.development: PGDATABASE=nc_news

In .env.test: PGDATABASE=nc_news_test

These files will allow your project to connect to the correct databases in each environment.

Your .gitignore file should already include .env.\* to ensure these files are not pushed to GitHub.

If it doesn’t, add .env.\* manually.
