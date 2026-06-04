# JWT Authentication & Authorization Middleware

## Overview

This implementation provides a secure and scalable authentication/authorization layer for the QualiFlow backend using:

- JSON Web Tokens (JWT)
- Express middleware
- Role-Based Access Control (RBAC)
- Processus isolation checks
- Centralized error handling

The middleware system is designed to be reusable, modular, and production-ready.

---

# Architecture

```text
Request
   ↓
verifyToken
   ↓
req.user injected
   ↓
checkRole / checkProcessus
   ↓
Controller / Route Handler
```

---

# Folder Structure

```text
server/
│
├── middleware/
│   ├── auth.js
│   ├── role.js
│   └── errorHandler.js
│
├── utils/
│   └── ApiError.js
│
├── routes/
│   └── auth.js
│
├── models/
│   └── User.js
│
├── app.js
├── index.js
└── .env
```

---

# Environment Variables

Create a `.env` file inside `server/`:

```env
PORT=5000

JWT_SECRET=your_super_secure_secret_key

MONGO_URI=your_mongodb_connection
```

---

# Dependencies

Install required packages:

```bash
npm install jsonwebtoken bcryptjs dotenv
```

---

# JWT Payload Structure

The backend signs JWT tokens using the following payload:

```js
{
  _id: user._id,
  email: user.email,
  role: user.role,
  processus_id: user.processus_id,
  site_id: user.site_id
}
```

This payload becomes available later through:

```js
req.user
```

after token verification.

---

# Middleware: `auth.js`

## Purpose

Responsible for:

- extracting JWT from Authorization header
- validating token signature
- checking expiration
- injecting authenticated user into `req.user`

---

## Expected Header Format

```http
Authorization: Bearer <TOKEN>
```

---

## Main Middleware

```js
verifyToken
```

### Responsibilities

- Validate Authorization header
- Verify JWT signature
- Decode token payload
- Reject invalid or expired tokens
- Attach authenticated user to request

---

## Example Implementation

```js
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");

  if (
    parts.length !== 2 ||
    parts[0] !== "Bearer"
  ) {
    return null;
  }

  return parts[1];
};

const verifyToken = (req, res, next) => {
  try {

    const token = extractToken(req);

    if (!token) {
      return next(
        new ApiError(
          401,
          "Authentication token missing or malformed"
        )
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
      processus_id: decoded.processus_id,
      site_id: decoded.site_id
    };

    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(
          401,
          "Token expired"
        )
      );
    }

    if (error.name === "JsonWebTokenError") {
      return next(
        new ApiError(
          401,
          "Invalid token"
        )
      );
    }

    return next(
      new ApiError(
        500,
        "Authentication failed"
      )
    );
  }
};

export {
  verifyToken
};
```

---

# Middleware: `role.js`

Provides authorization middleware.

---

# `checkRole(...roles)`

Restricts route access based on user role.

## Example

```js
checkRole("admin")
```

or:

```js
checkRole("admin", "manager")
```

---

# `checkProcessus`

Ensures users can only access resources belonging to their assigned processus.

---

# Example Implementation

```js
import ApiError from "../utils/ApiError.js";

const checkRole = (...allowedRoles) => {

  return (req, res, next) => {

    if (!req.user) {
      return next(
        new ApiError(
          401,
          "Unauthorized"
        )
      );
    }

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return next(
        new ApiError(
          403,
          "Forbidden: insufficient permissions"
        )
      );
    }

    next();
  };
};

const checkProcessus = (
  req,
  res,
  next
) => {

  if (!req.user) {
    return next(
      new ApiError(
        401,
        "Unauthorized"
      )
    );
  }

  if (req.user.role === "admin") {
    return next();
  }

  const userProcessus =
    req.user.processus_id?.toString();

  const requestedProcessus =
    req.params.processus_id;

  if (
    userProcessus !== requestedProcessus
  ) {
    return next(
      new ApiError(
        403,
        "Forbidden: processus mismatch"
      )
    );
  }

  next();
};

export {
  checkRole,
  checkProcessus
};
```

---

# Error Handling

Centralized error middleware is implemented in:

```text
middleware/errorHandler.js
```

---

# Example Implementation

```js
const errorHandler = (
  err,
  req,
  res,
  next
) => {

  console.error(err);

  const statusCode =
    err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error"
  });
};

export default errorHandler;
```

---

# API Error Utility

`utils/ApiError.js`

```js
class ApiError extends Error {

  constructor(
    statusCode,
    message
  ) {

    super(message);

    this.statusCode =
      statusCode;

    this.success = false;

    Error.captureStackTrace(
      this,
      this.constructor
    );
  }
}

export default ApiError;
```

---

# Route Protection Examples

## Public Route

```js
router.post(
  "/login",
  loginController
);
```

---

## Authenticated Route

```js
router.get(
  "/me",
  verifyToken,
  controller
);
```

---

## Role-Protected Route

```js
router.post(
  "/register",
  verifyToken,
  checkRole("admin"),
  controller
);
```

---

## Processus-Protected Route

```js
router.get(
  "/processus/:processus_id",
  verifyToken,
  checkProcessus,
  controller
);
```

---

# Authentication Flow

## Login

User submits credentials:

```http
POST /api/auth/login
```

Server:

1. validates credentials
2. signs JWT
3. returns token

---

## Frontend Stores Token

```js
localStorage.setItem(
  "token",
  token
);
```

---

## Frontend Sends Token

```http
Authorization: Bearer eyJhbGci...
```

---

## Middleware Verifies Token

```js
verifyToken
```

injects:

```js
req.user
```

---

## Authorization Middleware Executes

```js
checkRole
checkProcessus
```

---

# Security Considerations

## Never Store Sensitive Data in JWT

DO NOT include:

- passwords
- password hashes
- private user data

---

## Recommended JWT Payload

```js
{
  _id,
  email,
  role,
  processus_id,
  site_id
}
```

---

## JWT Expiration

Current configuration:

```js
expiresIn: "7d"
```

Recommended:
- short-lived access tokens
- refresh token system for production

---

# Testing with Postman

## Login

```http
POST /api/auth/login
```

Receive JWT token.

---

## Protected Route

```http
GET /api/auth/me
```

Add header:

```http
Authorization: Bearer <TOKEN>
```

---

## Expected Success Response

```json
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "...",
    "role": "admin"
  }
}
```

---

# Common Errors

## Missing Token

```json
{
  "success": false,
  "message":
    "Authentication token missing or malformed"
}
```

---

## Invalid Token

```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

## Expired Token

```json
{
  "success": false,
  "message": "Token expired"
}
```

---

# Middleware Order Matters

Correct:

```js
verifyToken
→ checkRole
→ controller
```

Incorrect:

```js
checkRole
→ verifyToken
```

because `req.user` does not yet exist.

---

# Coding Standards Used

- ES Modules (`import/export`)
- Async/Await
- Modular middleware architecture
- Centralized error handling
- Separation of concerns
- REST API conventions

---

# Final Notes

This middleware architecture is designed to:

- scale cleanly
- remain maintainable
- support enterprise RBAC
- enforce secure route access
- isolate processus data access

It provides a solid production-grade foundation for the QualiFlow backend authentication and authorization system.
