# Dungeon Crawler Carl session app

A web app for hosting "Dungeon Crawler Carl" TTRPG sessions. Two roles: **DM** and
**Player**. This is the first slice: authentication and role-based access control only —
no game features yet.

Stack: Spring Boot (Maven, Java 17) backend, React (Vite, TypeScript) frontend, PostgreSQL.
See `docs/adr/` for the reasoning behind these and other choices.

## Prerequisites

- JDK 17+
- Node 20+
- Docker Desktop (for local PostgreSQL)

## Local dev setup

1. Copy `.env.example` to `.env` and fill in real values (`JWT_SECRET` must be 32+ random
   characters — `openssl rand -base64 48` works).

2. Start Postgres:
   ```bash
   docker compose up -d postgres
   ```

3. Run the backend. Spring Boot doesn't read `.env` files itself, so export the variables
   into your shell first:
   ```bash
   set -a; source .env; set +a
   cd backend
   mvn spring-boot:run
   ```
   On startup, Flyway creates the schema and seeds two accounts (see
   `backend/src/main/resources/db/migration/V2__seed_initial_users.sql`):
   - `dm1` / `ChangeMe123!DM`
   - `player1` / `ChangeMe123!Player`

   The API listens on `http://localhost:8080`.

4. Run the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173`, log in as either seeded account.

## Adding a user

There's no sign-up page by design (see `docs/adr/0003-user-data-model-and-provisioning.md`).
To add one:

```bash
cd backend
mvn -q exec:java -Dexec.mainClass=com.crawlerlaughenstein.api.tools.PasswordHashCli -Dexec.args="<plaintext-password>"
```

Take the printed bcrypt hash and either hand-write a SQL `INSERT` against the running
database, or add a new Flyway migration (`V3__...sql`, etc.) if it should be reproducible
for every environment.

## Running the backend tests

Requires Docker running (tests spin up a real Postgres via Testcontainers):

```bash
cd backend
mvn test
```

## Project layout

```
backend/    Spring Boot API (Maven)
frontend/   React app (Vite + TypeScript)
docs/adr/   Architecture decision records
```
