---
name: backend-engineering
description: Standards and patterns for enterprise Node.js and Express.js REST API engineering, routing, controllers, middleware, and structured error handling.
---

# Backend Engineering Skill

## Architectural Structure
Follow the Controller-Service-Repository/Model pattern:
- **Routes (`routes/`)**: Pure route declarations mapping HTTP methods and endpoints to middleware chains and controller handlers.
- **Controllers (`controllers/`)**: Request parsing, calling service methods, mapping outputs to standardized HTTP responses.
- **Services (`services/`)**: Core domain business logic, orchestration of data layers, third-party integrations (payments, emails), transaction demarcations.
- **Models (`models/`)**: Mongoose schema definitions, field validations, indexes, and virtuals.
- **Middleware (`middleware/`)**: Authentication verification, role-based authorization, rate limiting, request validation, error formatting.

## API Response Format
All JSON responses must adhere to a standardized contract:
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { ... },
  "meta": { ... } // optional pagination or timestamps
}
```
For error responses:
```json
{
  "success": false,
  "message": "Clear explanation of the error",
  "errors": [ ... ] // detailed field-level validation errors if applicable
}
```

## Guidelines
- Never leave uncaught promise rejections; always wrap async route handlers with an `asyncHandler` wrapper or express async error catcher.
- Implement central error handling middleware with distinct development vs. production formatting (never expose stack traces in production).
- Use HTTP status codes correctly: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 422 (Unprocessable Entity), 500 (Internal Server Error).

