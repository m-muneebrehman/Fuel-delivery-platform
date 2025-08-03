# 🚗 Fuel Delivery Platform

A comprehensive full-stack fuel delivery platform that connects users, petrol pump owners, delivery personnel, and administrators in a seamless ecosystem for on-demand fuel delivery services.

## 🌟 Features

### 👤 User Features
- **Fuel Ordering**: Order fuel with real-time pricing and delivery tracking
- **Location Services**: Find nearby fuel pumps using Google Maps integration
- **Order Tracking**: Real-time order status updates and delivery tracking
- **Payment Integration**: Multiple payment methods (Credit Card, Debit Card, UPI, Net Banking)
- **Profile Management**: User profile and order history management
- **Delivery Scheduling**: Choose delivery time slots and addresses

### 🏪 Petrol Pump Owner Features
- **Dashboard Management**: Comprehensive dashboard for pump operations
- **Inventory Management**: Real-time fuel inventory tracking and updates
- **Order Management**: Accept, reject, and manage incoming fuel orders
- **Delivery Boy Management**: Assign and manage delivery personnel
- **Location Services**: Set pump location with GPS coordinates
- **Fuel Price Management**: Update fuel prices for different fuel types

### 🚚 Delivery Boy Features
- **Order Assignment**: Receive and manage assigned delivery orders
- **Real-time Tracking**: GPS-based location tracking for deliveries
- **Status Updates**: Update order status and delivery progress
- **Route Optimization**: Optimized delivery routes and navigation

### 👨‍💼 Admin Features
- **System Overview**: Comprehensive admin dashboard with system statistics
- **Fuel Price Management**: Centralized fuel price control and updates
- **User Management**: Monitor and manage all platform users
- **Pump Verification**: Verify and approve new petrol pump registrations
- **Analytics**: System-wide analytics and reporting
- **Notification Management**: Send system-wide notifications

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 19**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: Client-side routing
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API communication
- **React Leaflet**: Interactive maps integration
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible UI components
- **Lucide React**: Beautiful icons

### Backend (Node.js + Express)
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token authentication
- **bcrypt**: Password hashing and security
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logger
- **Joi**: Data validation

### Database Models
- **User**: Customer accounts and authentication
- **FuelPump**: Petrol pump information and locations
- **DeliveryBoy**: Delivery personnel management
- **FuelOrder**: Fuel delivery orders and tracking
- **Order**: General product orders
- **Inventory**: Fuel inventory management
- **FuelPrice**: Dynamic fuel pricing
- **BlacklistToken**: Token management for security

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Google Maps API Key
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fuel-delivery-platform.git
   cd fuel-delivery-platform
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/fuel-delivery
   JWT_SECRET=your-secret-key
   PORT=5000
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. **Database Setup**
   ```bash
   cd server
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend (from client directory)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📱 User Roles & Access

### Customer (User)
- **Login**: `/auth/user/login`
- **Signup**: `/auth/user/signup`
- **Dashboard**: `/user/dashboard`
- **Fuel Delivery**: `/user/fuel`
- **Orders**: `/user/orders`
- **Profile**: `/user/profile`

### Petrol Pump Owner
- **Login**: `/auth/petrol-owner/login`
- **Signup**: `/auth/petrol-owner/signup`
- **Dashboard**: `/petrol-owner/dashboard`
- **Settings**: `/petrol-owner/settings`

### Delivery Boy
- **Login**: `/deliveryBoy`
- **Dashboard**: `/deliveryBoy/dashboard`

### Admin
- **Login**: Username: `admin`, Password: `admin123`
- **Dashboard**: `/admin`
- **Store Management**: `/admin/store`
- **Fuel Prices**: `/admin/fuel-prices`
- **Notifications**: `/admin/notifications`

## 🔧 API Endpoints

### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /fuelpumps/register` - Pump owner registration
- `POST /fuelpumps/login` - Pump owner login

### Fuel Orders
- `POST /fuel-orders` - Create fuel order
- `GET /fuel-orders` - Get user orders
- `PUT /fuel-orders/:id` - Update order status
- `GET /fuel-orders/:id` - Get order details

### Fuel Pumps
- `GET /fuelpumps/nearby` - Find nearby pumps
- `PUT /fuelpumps/:id` - Update pump information
- `GET /fuelpumps/:id` - Get pump details

### Inventory
- `GET /inventory` - Get inventory items
- `POST /inventory` - Add inventory item
- `PUT /inventory/:id` - Update inventory

### Fuel Prices
- `GET /fuel-prices` - Get current fuel prices
- `PUT /fuel-prices` - Update fuel prices

## 🗄️ Database Schema

### User Model
```javascript
{
  userName: String,
  email: String,
  password: String,
  phoneNumber: String,
  socketId: String
}
```

### FuelPump Model
```javascript
{
  name: String,
  email: String,
  password: String,
  location: {
    type: String,
    coordinates: [Number],
    address: String
  },
  fuelAvailable: {
    petrol: Number,
    diesel: Number,
    hioctane: Number
  },
  isVerified: Boolean
}
```

### FuelOrder Model
```javascript
{
  user: ObjectId,
  fuelPump: ObjectId,
  deliveryBoy: ObjectId,
  orderStatus: String,
  fuelType: String,
  quantity: Number,
  deliveryFare: Number,
  totalAmount: Number,
  deliveryAddress: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  }
}
```

## 🎨 UI Components

### Core Components
- **Navigation**: Responsive navbar with role-based menus
- **Cards**: Reusable card components for products and orders
- **Modals**: Confirmation and detail modals
- **Forms**: Validated input forms with error handling
- **Maps**: Interactive maps with location services
- **Tables**: Sortable and filterable data tables

### Styling
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: Theme switching capability
- **Animations**: Smooth transitions and micro-interactions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Server-side validation with Joi
- **CORS Protection**: Cross-origin request handling
- **Rate Limiting**: API rate limiting for abuse prevention
- **Token Blacklisting**: Secure logout and token invalidation

## 📊 Key Features

### Real-time Features
- **Live Order Tracking**: Real-time order status updates
- **GPS Tracking**: Delivery boy location tracking
- **Push Notifications**: Order status notifications
- **Live Chat**: Customer support integration

### Payment Integration
- **Multiple Payment Methods**: Credit/Debit cards, UPI, Net Banking
- **Secure Transactions**: Encrypted payment processing
- **Payment Status Tracking**: Real-time payment confirmation

### Location Services
- **Google Maps Integration**: Interactive maps and location services
- **Geolocation**: Automatic location detection
- **Route Optimization**: Efficient delivery routes
- **Nearby Search**: Find closest fuel pumps

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist folder
```

### Backend Deployment (Railway/Heroku)
```bash
cd server
# Set environment variables
npm start
```

### Database Deployment (MongoDB Atlas)
- Create MongoDB Atlas cluster
- Update connection string in environment variables
- Configure network access and security


**Built with ❤️ using React, Node.js, and MongoDB**
