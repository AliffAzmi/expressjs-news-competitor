# expressjs-news-competitor

The list of online news in Malaysia. Built on Express.js.

## Prerequisites

You will need:

- NodeJS and NPM
- [MongoDB](http://docs.mongodb.org/manual/installation/) installed and running

## Getting Started

1. Install NodeJS and NPM.
2. Install MongoDB using the provided link
3. Create a new MongoDB database `competitor` with the collections `entries` and `publishers`. For this tutorial we use root access to connect to MongoDB.
4. Now run the following commands:

```bash
 git clone git@github.com:AliffAzmi/expressjs-news-competitor.git
 cd expressjs-news-competitor
 npm install
 npm run tailwind:css
 node cron/ingestPublishers.js (run faker to generate publishers)
 npm run dev
 node cron/ingestNews.js (cron to pull articles from feed)
```

Navigate to [localhost:3000](http://localhost:3000) to view your app.
