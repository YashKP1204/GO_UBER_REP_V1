# User API Documentation

## POST /users/register

### Description
This endpoint registers a new user in the system. It validates the provided credentials, hashes the password using bcrypt, and returns a JWT token for authentication.

### Request Method
```
POST /users/register
```
       

### Request Headers
```
Content-Type: application/json
```

### Request Body
The request body must be a JSON object with the following required fields:

| Field | Type | Required | Validation | Description |
|-------|------|----------|-----------|-------------|
| `fullname.firstname` | String | Yes | Minimum 3 characters | User's first name |
| `fullname.lastname` | String | No | Minimum 3 characters (if provided) | User's last name |
| `email` | String | Yes | Valid email format | User's email address |
| `password` | String | Yes | Minimum 6 characters | User's password (will be hashed) |

### Request Body Example
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| `201` | User created successfully |
| `400` | Bad request - validation errors |
| `500` | Internal server error |

### Success Response (201 Created)
```json
{
  "user": {
    "_id": "60d5ec49c1234567890abc12",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response (400 Bad Request)
```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "ab",
      "msg": "First name must be at least 3 characters long",
      "path": "fullname.firstname",
      "location": "body"
    }
  ]
}
```

### Validation Rules
- **Email**: Must be a valid email format
- **First Name**: Must be at least 3 characters long
- **Password**: Must be at least 6 characters long
- **Last Name**: Optional, but if provided must be at least 3 characters long

### Notes
- Password is automatically hashed using bcrypt with 10 salt rounds before storage
- A JWT token with 7-day expiration is generated and returned upon successful registration
- The `JWT_SECRET` environment variable must be set for token generation

---

## POST /users/login

### Description
This endpoint authenticates a user by verifying their email and password. Upon successful authentication, it returns a JWT token for subsequent authenticated requests.

### Request Method
```
POST /users/login
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
The request body must be a JSON object with the following required fields:

| Field | Type | Required | Validation | Description |
|-------|------|----------|-----------|-------------|
| `email` | String | Yes | Valid email format | User's registered email address |
| `password` | String | Yes | Minimum 6 characters | User's password |

### Request Body Example
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Login successful |
| `400` | Bad request - validation errors |
| `401` | Unauthorized - invalid email or password |
| `500` | Internal server error |

### Success Response (200 OK)
```json
{
  "user": {
    "_id": "60d5ec49c1234567890abc12",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response (400 Bad Request)
```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    },
    {
      "type": "field",
      "value": "",
      "msg": "Password is required",
      "path": "password",
      "location": "body"
    }
  ]
}
```

### Error Response (401 Unauthorized)
```json
{
  "errors": [
    {
      "msg": "Invalid email or password"
    }
  ]
}
```

### Validation Rules
- **Email**: Must be a valid email format
- **Password**: Must not be empty and must be at least 6 characters long

### Notes
- If the email is not found in the database, a 401 Unauthorized response is returned
- If the password does not match the stored hashed password, a 401 Unauthorized response is returned
- A JWT token with 7-day expiration is generated and returned upon successful authentication
- The `JWT_SECRET` environment variable must be set for token generation

---

## GET /users/profile

### Description
This endpoint retrieves the authenticated user's profile information. It requires a valid JWT token for authentication.

### Request Method
```
GET /users/profile
```

### Request Headers
```
Authorization: Bearer <token>
```
or
```
Cookie: token=<token>
```

### Authentication
This endpoint requires authentication. You must provide a valid JWT token obtained from the `/users/register` or `/users/login` endpoint.

### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Profile retrieved successfully |
| `401` | Unauthorized - invalid or missing token |
| `500` | Internal server error |

### Success Response (200 OK)
```json
{
  "user": {
    "_id": "60d5ec49c1234567890abc12",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

### Error Response (401 Unauthorized)
```json
{
  "errors": [
    {
      "msg": "No token, authorization denied"
    }
  ]
}
```

### Notes
- Only authenticated users can access this endpoint
- The user's password is not included in the response for security reasons
- The token must be valid and not expired

---

## GET /users/logout

### Description
This endpoint logs out the authenticated user by clearing their authentication token and adding it to a blacklist to prevent reuse.

### Request Method
```
GET /users/logout
```

### Request Headers
```
Authorization: Bearer <token>
```
or
```
Cookie: token=<token>
```

### Authentication
This endpoint requires authentication. You must provide a valid JWT token obtained from the `/users/register` or `/users/login` endpoint.

### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | Logged out successfully |
| `401` | Unauthorized - invalid or missing token |
| `500` | Internal server error |

### Success Response (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

### Error Response (401 Unauthorized)
```json
{
  "errors": [
    {
      "msg": "No token, authorization denied"
    }
  ]
}
```

### Notes
- Only authenticated users can access this endpoint
- The authentication token is cleared from cookies
- The token is added to a blacklist with a 24-hour expiration to prevent token reuse
- After logout, the user must login again to access protected endpoints
