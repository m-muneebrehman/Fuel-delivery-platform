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

## Delivery Boy APIs

### Register Delivery Boy
Creates a new delivery boy account.

**Endpoint:** `POST /deliveryBoys/register`

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

**Response (201 Created):**
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

### Login Delivery Boy
Authenticates a delivery boy and returns a token.

**Endpoint:** `POST /deliveryBoys/login`

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

**Response (200 OK):**
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

### Get Delivery Boy Profile
Retrieves the profile of the authenticated delivery boy.

**Endpoint:** `GET /deliveryBoys/profile`

**Headers:**
- `Authorization`: Bearer jwt_token_string

**Response (200 OK):**
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

### Logout Delivery Boy
Invalidates the current delivery boy's token.

**Endpoint:** `GET /deliveryBoys/logout`

**Headers:**
- `Authorization`: Bearer jwt_token_string

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Inventory APIs

### Create Inventory Item
Creates a new inventory item.

**Endpoint:** `POST /inventory/`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "name": "Bosch Brake Pad Set",
  "description": "High-performance brake pads for front wheels",
  "category": "Brake System",
  "price": 89.99,
  "quantity": 50,
  "manufacturer": "Bosch",
  "compatibleVehicles": [
    {
      "make": "Toyota",
      "model": "Camry",
      "year": 2020
    }
  ],
  "images": [
    "https://example.com/brakepad1.jpg"
  ],
  "specifications": {
    "material": "Ceramic",
    "thickness": "12mm"
  },
  "sku": "BRK-BOS-FRONT-2023",
  "warranty": {
    "duration": 24,
    "description": "2-year manufacturer warranty"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    // Created inventory item
  }
}
```

### Get All Inventory Items

**Endpoint:** `GET /inventory/`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` (default: "name")
- `sortOrder` (default: "asc")
- `category` (optional)
- `manufacturer` (optional)
- `minPrice` (optional)
- `maxPrice` (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    // Array of inventory items
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

### Get Inventory Item by ID

**Endpoint:** `GET /inventory/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    // Single inventory item
  }
}
```

### Get Inventory Item by SKU

**Endpoint:** `GET /inventory/sku/:sku`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    // Single inventory item
  }
}
```

### Update Inventory Item

**Endpoint:** `PUT /inventory/:id`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "name": "Updated Name",
  "price": 99.99,
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    // Updated inventory item
  }
}
```

### Update Inventory Quantity

**Endpoint:** `PATCH /inventory/:id/quantity`

**Auth Required:** Yes (Admin)

**Request Body:**
```json
{
  "quantityChange": 10
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    // Updated inventory item
  }
}
```

### Delete Inventory Item

**Endpoint:** `DELETE /inventory/:id`

**Auth Required:** Yes (Admin)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Inventory item deleted successfully"
}
```

### Get Items by Category

**Endpoint:** `GET /inventory/category/:category`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` (default: "name")
- `sortOrder` (default: "asc")

### Get Items by Manufacturer

**Endpoint:** `GET /inventory/manufacturer/:manufacturer`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` (default: "name")
- `sortOrder` (default: "asc")

### Search by Compatible Vehicle

**Endpoint:** `GET /inventory/vehicle/search`

**Query Parameters:**
- `make` (required)
- `model` (required)
- `year` (required)
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` (default: "name")
- `sortOrder` (default: "asc")

## Order APIs

### Create Order

**Endpoint:** `POST /orders/`

**Auth Required:** Yes

**Request Body:**
```json
{
  "items": [
    {
      "itemId": "inventory_item_id",
      "name": "Brake Pads",
      "quantity": 2,
      "price": 89.99
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "zipCode": "12345",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "paymentMethod": "credit-card",
  "deliveryDate": "2024-03-01",
  "deliveryTimeSlot": {
    "start": "09:00",
    "end": "12:00"
  },
  "notes": "Please deliver in the morning"
}
```

**Response:**
```json
{
  "id": "order_id",
  "items": [
    {
      "itemId": "inventory_item_id",
      "name": "Brake Pads",
      "quantity": 2,
      "price": 89.99
    }
  ],
  "totalAmount": 179.98,
  "status": "pending",
  "paymentStatus": "pending",
  "deliveryDate": "2024-03-01",
  "deliveryTimeSlot": {
    "start": "09:00",
    "end": "12:00"
  }
}
```

### Get User Orders

**Endpoint:** `GET /orders/my-orders`

**Auth Required:** Yes

**Response:**
```json
[
  {
    "id": "order_id",
    "items": [
      {
        "itemId": "inventory_item_id",
        "name": "Brake Pads",
        "quantity": 2,
        "price": 89.99
      }
    ],
    "totalAmount": 179.98,
    "status": "pending",
    "paymentStatus": "pending",
    "deliveryDate": "2024-03-01",
    "deliveryTimeSlot": {
      "start": "09:00",
      "end": "12:00"
    }
  }
]
```

### Get Order by ID

**Endpoint:** `GET /orders/:id`

**Auth Required:** Yes

### Update Order Status

**Endpoint:** `PUT /orders/:id/status`

**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "confirmed"
}
```

### Cancel Order

**Endpoint:** `PUT /orders/:id/cancel`

**Auth Required:** Yes

### Get All Orders (Admin)

**Endpoint:** `GET /orders/`

**Auth Required:** Yes (Admin)

## Maps APIs

### Get Delivery Route

**Endpoint:** `GET /maps/route`

**Auth Required:** Yes

**Query Parameters:**
```
origin=40.7128,-74.0060&destination=40.7130,-74.0062
```

**Response:**
```json
{
  "distance": {
    "text": "2.3 km",
    "value": 2300
  },
  "duration": {
    "text": "5 mins",
    "value": 300
  },
  "route": [
    {
      "lat": 40.7128,
      "lng": -74.0060
    },
    {
      "lat": 40.7129,
      "lng": -74.0061
    },
    {
      "lat": 40.7130,
      "lng": -74.0062
    }
  ]
}
```

### Get Address Coordinates

**Endpoint:** `GET /maps/address-coordinates`

**Query Parameters:**
```
address=123 Main Street, City, Country
```

### Get Location Suggestions

**Endpoint:** `GET /maps/location-suggestions`

**Query Parameters:**
```
query=Main Street
```

### Get Distance

**Endpoint:** `GET /maps/distance`

**Query Parameters:**
```
origin=40.7128,-74.0060&destination=40.7130,-74.0062
```

### Get Nearby Registered Fuel Pumps

**Endpoint:** `GET /maps/nearby-registered-fuel-pumps`

**Query Parameters:**
```
lat=40.7128&lng=-74.0060&radius=5000
```

**Response:**
```json
[
  {
    "id": "pump_id",
    "location": "Downtown Gas Station",
    "address": "100 Main St, City, State 12345",
    "coordinates": {
      "latitude": 40.7130,
      "longitude": -74.0062
    },
    "distance": {
      "text": "0.5 km",
      "value": 500
    },
    "fuelTypes": ["Regular", "Premium", "Diesel"],
    "status": "operational"
  }
]
```

### Get Delivery Time Estimate

**Endpoint:** `GET /maps/delivery-time`

**Query Parameters:**
```
origin=40.7128,-74.0060&destination=40.7130,-74.0062&mode=driving
```

**Response:**
```json
{
  "estimatedTime": {
    "text": "5 mins",
    "value": 300
  },
  "trafficConditions": "moderate",
  "alternativeRoutes": [
    {
      "distance": {
        "text": "2.5 km",
        "value": 2500
      },
      "duration": {
        "text": "6 mins",
        "value": 360
      }
    }
  ]
}
```