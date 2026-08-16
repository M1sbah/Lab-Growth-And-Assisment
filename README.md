# Lab Growth And Assessment

A Node.js/Express web application for managing student assignments and mark
sheets. Faculty can create assignments and evaluate submissions; students can
register, log in, submit assignments, and view their mark sheets. Server-side
views are rendered with Handlebars (`hbs`), data is persisted in MongoDB via
Mongoose, and authentication uses JWTs alongside session cookies.

## Features

- Faculty and student registration/login
- JWT-based API authentication (`/api/todo/auth`)
- Assignment creation and submission
- Mark sheet generation and evaluation
- Server-rendered dashboards for admin and student views

## Tech Stack

- **Runtime:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Views:** Handlebars (`hbs`)
- **Auth:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs` for password hashing
- **Dev tooling:** `nodemon`

## Project Structure

```
config/       Environment loading and MongoDB connection
middleware/   JWT auth middleware
models/       Mongoose schemas (User, Assignment, MarkSheet, ...)
routes/       Express routers (admin, student, assignment, marks, ...)
temperates/   Handlebars views and partials
public/       Static assets (CSS)
images/       Static image assets
src/server.js Application entry point
```

## ML Service

The [ML/](ML/) directory contains a standalone Flask microservice used to
auto-evaluate student assignment answers. It compares a student's answer
against the reference answer using keyword overlap, Word2Vec-based semantic
similarity, grammar checking, and answer length, then writes the computed
marks directly to MongoDB.

- **Runtime:** Python 3.11, Flask
- **NLP/ML:** `gensim` (Word2Vec via Google News pretrained vectors),
  `nltk` (tokenization, stopwords), `language_tool_python` (grammar checking)
- **Database:** MongoDB via `pymongo`
- **Entry point:** [ML/main.py](ML/main.py) — run with `python main.py`
  (serves on `http://localhost:5000` by default)

### Setup

1. Create a virtual environment in `ML/` and install dependencies (Flask,
   gensim, nltk, numpy, language_tool_python, pymongo). No `requirements.txt`
   is currently checked in — one should be generated (`pip freeze`) to pin
   versions.
2. Download the pretrained
   [GoogleNews-vectors-negative300.bin](https://code.google.com/archive/p/word2vec/)
   model (~3.4GB) and place it at `ML/GoogleNews-vectors-negative300.bin`.
   On first run, `main.py` converts and caches it as `wv.model` /
   `wv.model.vectors.npy` for faster subsequent loads. These files are large
   and gitignored — they must be provided locally, not committed.
3. `ML/stopwords.txt` is included in the repo and used for keyword matching.
4. Set the `MONGO_URI` environment variable to your MongoDB connection
   string before running `main.py` or `DbConn.py` — both read it via
   `os.environ['MONGO_URI']`.

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or later
- npm (bundled with Node.js)
- A MongoDB instance — either a local server or a connection string from
  [MongoDB Atlas](https://www.mongodb.com/atlas)

## Running Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/M1sbah/Lab-Growth-And-Assisment.git
   cd Lab-Growth-And-Assisment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `config/config.env` file in the project root with the following
   keys:

   ```env
   MONGO_URI=<your MongoDB connection string>
   PORT=3000
   jwtUserSecret=<a secret string used to sign JWTs>
   ```

   This file is gitignored and must be created locally — it is not committed
   to the repository.

4. **Start the server**

   ```bash
   npm start
   ```

   This runs `nodemon src/server.js`, which restarts automatically on file
   changes. By default the app is available at `http://localhost:3000`.

## Available Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| `npm start`   | Runs the server with `nodemon`       |
| `npm test`    | Not yet configured                   |
