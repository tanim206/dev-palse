# DevPulse

DevPulse is a TypeScript-based Express API for basic issue tracking with user authentication and role-based access control.

## Features

- User signup and login with JWT authentication
- Issue creation, retrieval, updates, and deletion
- PostgreSQL database using `pg`
- Role-based access control for protected routes
- Error handling middleware

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- `pg`
- `jsonwebtoken`
- `bcryptjs`
- `dotenv`
- `tsup`

## Project Structure

- `src/app.ts` - main Express application and routing
- `src/server.ts` - HTTP server startup and database initialization
- `src/app/modules/auth` - authentication controllers and routes
- `src/app/modules/issues` - issue controllers and routes
- `src/app/middleware` - authentication and error handling middleware
- `src/db/index.ts` - PostgreSQL connection and table creation
- `src/app/config/index.ts` - environment config loader

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the following variables:

   ```env
   PORT=5000
   CONNECTIONSTRING=postgresql://user:password@host:port/database
   SECRET_KEY=your_jwt_secret
   ```

3. Run the app in development mode:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Start the built app:

   ```bash
   npm start
   ```

## Environment Variables

- `PORT` - port where the server listens
- `CONNECTIONSTRING` - PostgreSQL connection string
- `SECRET_KEY` - secret key for JWT signing

## Available Scripts

- `npm run dev` - run the server with `tsx` in watch mode
- `npm run build` - compile TypeScript with `tsup`
- `npm start` - run the compiled production server

## API Endpoints

### Auth

- `POST /api/auth/signup`
  - Request body: `{ name, email, password, role? }`
  - Creates a user and returns user data

- `POST /api/auth/login`
  - Request body: `{ email, password }`
  - Returns JWT token and user info

### Issues

- `POST /api/issues`
  - Protected route
  - Required header: `Authorization: <token>`
  - Request body: `{ title, description, type?, status?, reporter_id }`

- `GET /api/issues`
  - Public route
  - Returns all issues

- `GET /api/issues/:id`
  - Public route
  - Returns a single issue by ID

- `PATCH /api/issues/:id`
  - Protected route
  - Required header: `Authorization: <token>`
  - Updates issue fields

- `DELETE /api/issues/:id`
  - Protected route
  - Required header: `Authorization: <token>`
  - Only users with the `maintainer` role can delete issues

## Notes

- The database tables are created automatically at startup if they do not already exist.
- User roles default to `contributor` when not provided.
- The `DELETE /api/issues/:id` route is restricted with `roleCheck("maintainer")`.

## Troubleshooting

- If the server fails to start, verify the database connection string and that PostgreSQL is running.
- If JWT authentication fails, make sure `SECRET_KEY` matches the key used in your application.
