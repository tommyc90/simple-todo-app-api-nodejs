# Simple Todo App API - Node.js

This is a demo backend API app for a todo list, built with Node.js, Fastify, and MongoDB.

## Running Locally (Development)

You can run the app locally using Docker Compose in development mode with hot reload:

```bash
docker-compose up -d
docker-compose exec app npm run watch
```

## Running Locally (Production)

To run the app as in production mode (compiled and optimized):

```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up
```

The api will be available on http://localhost:3000.


## Environment Variables

- `MONGO_URI`: MongoDB connection string (default in docker-compose is `mongodb://mongo:27017/todo_app_data`).
- `AUTH_JWT_SECRET`: JWT secret for authentication.
- `NODE_ENV`: Should be set to `production` in production.

## API Overview

The backend exposes a RESTful API under the `/api` prefix with two main resource groups:

### User Routes (`/api/users`)

- **POST `/api/users`**  
  Create a new user.  
  Request body must include unique username and strong password.

- **POST `/api/users/auth`**  
  Authenticate user and receive a JWT token.  
  Request body must include username and password.

- **GET `/api/users/:id`**  
  Get user details by user ID (`:id` can also be `"me"` or `"self"` for the current user).  
  Requires valid JWT in Authorization header.

### Todo Routes (`/api/todos`)

All Todo routes require authentication (JWT).

- **GET `/api/todos`**  
  List all todos for the authenticated user.

- **GET `/api/todos/:id`**  
  Get a single todo by its ID.

- **POST `/api/todos`**  
  Create a new todo.

- **POST `/api/todos/:id`**  
  Update an existing todo by ID.

- **DELETE `/api/todos/:id`**  
  Delete a todo by ID.

### Authentication

- JWT authentication is required for all user-specific or todo-specific endpoints except user creation and authentication.
- Include the JWT token in the `Authorization` header as:  
  `Authorization: Bearer <token>`
