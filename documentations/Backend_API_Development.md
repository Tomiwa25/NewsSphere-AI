# Backend API Development

## 1. Express Server Configuration

The backend of NewsSphere AI is built using Node.js and Express in TypeScript. Its purpose is to serve the frontend, expose REST API routes, connect to MongoDB, and integrate with external news providers.

### Core server setup

```ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import newsRoutes from "./routes/newsRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "NewsSphere AI API is running", status: "ok" });
});

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "NewsSphere backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Recommended middleware

- `cors()` to allow frontend access
- `express.json()` to parse incoming JSON
- custom error middleware
- route-level prefixing such as `/api/news`
- environment-based configuration using `.env`

### Environment variables


## 2. MongoDB Connection

MongoDB is connected through Mongoose using a dedicated database utility module.

### Database connection example


### Connection best practices

- Store connection string in `.env`
- Use a single connection utility across the app
- Log connection events for debugging
- Handle DB failures gracefully with process exit or retry logic

### Example folder structure

```text
backend/
  src/
    config/
      db.ts
    controllers/
      authController.ts
      newsController.ts
      userController.ts
    models/
      User.ts
      Article.ts
      Source.ts
      Preference.ts
      SavedArticle.ts
    routes/
      authRoutes.ts
      newsRoutes.ts
      userRoutes.ts
    services/
      newsService.ts
    utils/
      validators.ts
    server.ts
```

---

## 3. API Folder Setup

A clean and scalable API layout is essential for maintainability.

### Folder responsibilities

#### `config/`
- database connections
- environment configuration
- app constants

#### `controllers/`
- handle HTTP requests
- parse request data
- call business logic
- return JSON responses

#### `routes/`
- define API endpoints
- map URL paths to controller functions

#### `models/`
- MongoDB/Mongoose schemas
- validation rules and model definitions

#### `services/`
- fetch external news data
- normalize article results
- run business logic such as filtering or sorting

#### `utils/`
- validation helpers
- response formatting
- common helper functions

---

## 4. News API Integration

The backend fetches fresh articles from external sources like GNews or the Guardian to keep the app updated.

### Example service logic



### Data normalization process

When data arrives from the source API, it should be normalized into a consistent structure before being saved to MongoDB.

```ts
const normalizeArticle = (article: any) => ({
  title: article.title,
  summary: article.description || article.content || "No summary available",
  url: article.url,
  source: article.source?.name || "Unknown",
  author: article.author || "Unknown",
  publishedAt: article.publishedAt || new Date(),
  imageUrl: article.image || "",
  category: "general",
});
```

### Integration responsibilities

- fetch article data from external APIs
- handle rate limits and timeouts
- sanitize incoming response data
- deduplicate article URLs
- store normalized data in MongoDB
- return filtered data to the frontend

### Suggested API route

```ts
GET /api/news/top-headlines?category=technology
GET /api/news/search?q=AI
GET /api/news/source/:source
```

---

## 5. Authentication API

Authentication is required for user accounts, saved articles, personalized recommendations, and profile management.

### Recommended auth endpoints

#### Register user

```http
POST /api/auth/register
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token"
}
```

#### Login user

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Get current user

```http
GET /api/auth/me
```

Protected route using JWT middleware.

### JWT setup example

```ts
import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
```

### Authentication middleware

```ts
export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

---

## 6. CRUD Operations

The API will support CRUD operations for articles, users, preferences, and saved items.

### User CRUD

#### Create

```http
POST /api/users
```

#### Read

```http
GET /api/users
GET /api/users/:id
```

#### Update

```http
PUT /api/users/:id
```

#### Delete

```http
DELETE /api/users/:id
```

### News CRUD-like operations

#### Get news feed

```http
GET /api/news
```

#### Search articles

```http
GET /api/news/search?q=climate
```

#### Save article

```http
POST /api/news/save
```

#### Get saved articles

```http
GET /api/news/saved
```

### Preference CRUD

```http
POST /api/users/preferences
GET /api/users/preferences/:userId
PUT /api/users/preferences/:userId
DELETE /api/users/preferences/:userId
```

### Example article controller flow

```ts
export const getTopHeadlines = async (req: Request, res: Response) => {
  try {
    const category = req.query.category || "general";
    const articles = await fetchNewsFromProvider(category as string);

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
};
```

---

## 7. Testing Endpoints with Postman

Postman is used to test API endpoints during development before integrating with the frontend.

### Basic setup

1. Start the backend server.
2. Open Postman.
3. Create a new request.
4. Use the correct URL, method, and body type.
5. Send the request and inspect the response.

### Example test cases

#### Health check

```http
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "NewsSphere backend",
  "timestamp": "2026-09-28T12:00:00.000Z"
}
```

#### Register user

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json
```

Body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```

#### Get top headlines

```http
GET http://localhost:5000/api/news/top-headlines?category=technology
```

#### Save article

```http
POST http://localhost:5000/api/news/save
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

Body:

```json
{
  "articleId": "64fa6d4d91dfc2b1f7bc5678"
}
```

### Postman testing best practices

- test happy paths and error paths
- validate status codes such as 200, 201, 400, 401, and 500
- inspect request and response bodies
- verify JWT authentication flow
- confirm MongoDB writes are successful

---

## 8. Recommended Response Format

All API endpoints should return consistent JSON structure.

### Success response

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

### Error response

```json
{
  "success": false,
  "message": "Something went wrong",
  "error": "Detailed error information"
}
```

---

## 9. Summary

The backend API for NewsSphere AI is designed around Express, MongoDB, and modular controller-service architecture. It provides a clean interface for user authentication, article retrieval, saved content, and personalization features. Testing with Postman helps validate the API behavior and ensures the system is ready for frontend integration.
