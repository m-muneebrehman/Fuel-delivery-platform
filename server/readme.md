# Fuel Delivery Platform API Documentation

This documentation provides details about the API endpoints available in the Fuel Delivery Platform.

## Authentication and User Management APIs

### Register User
Creates a new user account.

**Endpoint:** `POST /api/user/register`

**Request Body:**
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

**Validation Rules:**
- Email must be a valid email address
- First name must be at least 3 characters long
- Password must be at least 6 characters long

**Response (201 Created):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or user already exists
- `500 Internal Server Error`: Server-side error

### Login User
Authenticates a user and returns a token.

**Endpoint:** `POST /api/user/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- Email must be a valid email address
- Password must be at least 6 characters long

**Response (200 OK):**
```json
{
  "token": "jwt_token_string",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Invalid email or password
- `500 Internal Server Error`: Server-side error

### Get User Profile
Retrieves the profile of the authenticated user.

**Endpoint:** `GET /api/user/profile`

**Headers:**
- `Authorization`: Bearer jwt_token_string

**Response (200 OK):**
```json
{
  "_id": "user_id",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server-side error

### Logout User
Invalidates the current user's token.

**Endpoint:** `GET /api/user/logout`

**Headers:**
- `Authorization`: Bearer jwt_token_string

**Response (200 OK):**
```json
{
  "message": "Logout successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server-side error

## Authentication

All endpoints except for `/register` and `/login` require authentication. To authenticate requests, include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

The token is valid for 1 day from issuance.

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in case of failure. Common error responses include:

- `400 Bad Request`: Client-side errors such as invalid input
- `401 Unauthorized`: Authentication errors
- `500 Internal Server Error`: Server-side errors

## Data Models

### User
- `_id`: MongoDB ObjectId (automatically generated)
- `fullname`: 
  - `firstname`: String (required, min length: 3)
  - `lastname`: String (optional, min length: 3 if provided)
- `email`: String (required, min length: 5)
- `password`: String (required, stored as hashed value)
- `socketId`: String (optional)