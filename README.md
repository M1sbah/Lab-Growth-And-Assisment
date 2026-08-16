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
