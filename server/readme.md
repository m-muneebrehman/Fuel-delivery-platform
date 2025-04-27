# Fuel Delivery Platform API Documentation

This documentation provides details about the API endpoints available in the Fuel Delivery Platform.

## Authentication and User Management APIs

### Register User
Creates a new user account.

**Endpoint:** `POST /users/register`

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

**Endpoint:** `POST /users/login`

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

**Endpoint:** `GET /users/profile`

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

**Endpoint:** `GET /users/logout`

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

All endpoints except for `/users/register` and `/users/login` require authentication. To authenticate requests, include the JWT token in the Authorization header:

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










## Fuel Pump Management APIs

### Register Fuel Pump
Creates a new fuel pump station account.

**Endpoint:** `POST /fuelpumps/register`

**Request Body:**
```json
{
  "email": "fuelpump1@example.com",
  "name": "City Center Fuel Station",
  "password": "secure123",
  "location": "123 Main Street, Downtown"
}
```

**Validation Rules:**
- Email must be a valid email address
- Name must be at least 3 characters long
- Password must be at least 6 characters long
- Location must be at least 3 characters long

**Response (201 Created):**
```json
{
  "token": "jwt_token_string",
  "fuelPump": {
    "_id": "fuelpump_id",
    "email": "fuelpump1@example.com",
    "name": "City Center Fuel Station",
    "location": "123 Main Street, Downtown"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors or fuel pump already exists
- `500 Internal Server Error`: Server-side error

### Login Fuel Pump
Authenticates a fuel pump station and returns a token.

**Endpoint:** `POST /fuelpumps/login`

**Request Body:**
```json
{
  "email": "fuelpump1@example.com",
  "password": "secure123"
}
```

**Validation Rules:**
- Email must be a valid email address
- Password must be at least 6 characters long

**Response (200 OK):**
```json
{
  "token": "jwt_token_string",
  "fuelPump": {
    "_id": "fuelpump_id",
    "email": "fuelpump1@example.com",
    "name": "City Center Fuel Station",
    "location": "123 Main Street, Downtown"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Invalid email or password
- `500 Internal Server Error`: Server-side error

### Get Fuel Pump Profile
Retrieves the profile of the authenticated fuel pump station.

**Endpoint:** `GET /fuelpumps/profile`

**Headers:**
- `Authorization`: Bearer jwt_token_string

**Response (200 OK):**
```json
{
  "_id": "fuelpump_id",
  "email": "fuelpump1@example.com",
  "name": "City Center Fuel Station",
  "location": "123 Main Street, Downtown"
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server-side error

### Logout Fuel Pump
Invalidates the current fuel pump station's token.

**Endpoint:** `GET /fuelpumps/logout`

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





# Delivery Boy API Documentation

This documentation provides details about the Delivery Boy API endpoints, including request/response formats, validation rules, and authentication requirements.

## Base URL
```
http://your-domain/api/delivery-boy
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

## Endpoints

### 1. Register Delivery Boy
Register a new delivery boy in the system.

**Endpoint:** `POST /register`

**Request Body:**
```json
{
    "email": "deliveryboy1@example.com",
    "password": "123456",
    "fullName": "John Doe",
    "phoneNumber": "03001234567",
    "cnicNumber": "35201-1234567-1",
    "photo": "https://example.com/photo.jpg",
    "address": "123 Main Street, City, Country",
    "fuelPump": "Shell Station #1"
}
```

**Validation Rules:**
- `email`: Must be a valid email address
- `password`: Minimum 6 characters
- `fullName`: Minimum 3 characters
- `phoneNumber`: Must be exactly 11 digits
- `cnicNumber`: Must be in format: 12345-1234567-1
- `photo`: Required field
- `address`: Minimum 5 characters
- `fuelPump`: Required field

**Response:**
```json
{
    "success": true,
    "message": "Delivery boy registered successfully",
    "data": {
        "id": "user_id",
        "email": "deliveryboy1@example.com",
        "fullName": "John Doe",
        "phoneNumber": "03001234567",
        "cnicNumber": "35201-1234567-1",
        "photo": "https://example.com/photo.jpg",
        "address": "123 Main Street, City, Country",
        "fuelPump": "Shell Station #1"
    }
}
```

### 2. Login Delivery Boy
Authenticate a delivery boy and get access token.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
    "email": "deliveryboy1@example.com",
    "password": "123456"
}
```

**Validation Rules:**
- `email`: Must be a valid email address
- `password`: Minimum 5 characters

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "jwt_token_here",
        "user": {
            "id": "user_id",
            "email": "deliveryboy1@example.com",
            "fullName": "John Doe"
        }
    }
}
```

### 3. Get Delivery Boy Profile
Get the profile information of the authenticated delivery boy.

**Endpoint:** `GET /profile`

**Headers Required:**
```
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": "user_id",
        "email": "deliveryboy1@example.com",
        "fullName": "John Doe",
        "phoneNumber": "03001234567",
        "cnicNumber": "35201-1234567-1",
        "photo": "https://example.com/photo.jpg",
        "address": "123 Main Street, City, Country",
        "fuelPump": "Shell Station #1"
    }
}
```

### 4. Logout Delivery Boy
Logout the authenticated delivery boy.

**Endpoint:** `GET /logout`

**Headers Required:**
```
Authorization: Bearer your_jwt_token_here
```

**Response:**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

### Validation Error
```json
{
    "success": false,
    "message": "Validation Error",
    "errors": [
        {
            "field": "email",
            "message": "Invalid Email"
        }
    ]
}
```

### Authentication Error
```json
{
    "success": false,
    "message": "Unauthorized",
    "error": "Invalid or expired token"
}
```

### Server Error
```json
{
    "success": false,
    "message": "Internal Server Error",
    "error": "Error message details"
}
```

## Testing

### Test Data for Registration
```json
{
    "email": "deliveryboy1@example.com",
    "password": "123456",
    "fullName": "John Doe",
    "phoneNumber": "03001234567",
    "cnicNumber": "35201-1234567-1",
    "photo": "https://example.com/photo.jpg",
    "address": "123 Main Street, City, Country",
    "fuelPump": "Shell Station #1"
}
```

### Test Data for Login
```json
{
    "email": "deliveryboy1@example.com",
    "password": "123456"
}
```

## Notes
- All timestamps are in ISO 8601 format
- All monetary values are in the base currency unit
- File uploads should be handled through multipart/form-data
- Rate limiting may be applied to prevent abuse
- Tokens expire after 24 hours