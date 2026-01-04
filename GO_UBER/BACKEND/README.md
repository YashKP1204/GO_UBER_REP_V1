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
