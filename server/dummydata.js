const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/autoshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: String,
  address: String
});

const inventorySchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  price: Number,
  quantity: Number,
  manufacturer: String,
  compatibleVehicles: [{
    make: String,
    model: String,
    year: Number
  }],
  images: [String],
  specifications: Map,
  sku: String,
  isActive: Boolean,
  warranty: {
    duration: Number,
    description: String
  }
});

const fuelDeliverySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  fuelType: String,
  quantity: Number,
  deliveryAddress: String,
  deliveryDate: Date,
  status: String,
  price: Number,
  paymentStatus: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  }
});

const fuelPumpSchema = new mongoose.Schema({
  location: String,
  address: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  fuelTypes: [String],
  status: String,
  capacity: Number,
  currentLevel: Number
});

const User = mongoose.model('User', userSchema);
const InventoryItem = mongoose.model('InventoryItem', inventorySchema);
const FuelDelivery = mongoose.model('FuelDelivery', fuelDeliverySchema);
const FuelPump = mongoose.model('FuelPump', fuelPumpSchema);

// Sample Users
const users = [
  {
    name: "John Smith",
    email: "john@example.com",
    password: bcrypt.hashSync("password123", 10),
    phone: "555-0123",
    role: "customer",
    address: "123 Main St, City, State 12345"
  },
  {
    name: "Jane Doe", 
    email: "jane@example.com",
    password: bcrypt.hashSync("password456", 10),
    phone: "555-0124",
    role: "admin",
    address: "456 Oak Ave, City, State 12345"
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    password: bcrypt.hashSync("password789", 10),
    phone: "555-0125",
    role: "customer",
    address: "789 Elm St, City, State 12345"
  },
  {
    name: "Sarah Wilson",
    email: "sarah@example.com",
    password: bcrypt.hashSync("password101", 10),
    phone: "555-0126",
    role: "customer",
    address: "101 Pine St, City, State 12345"
  }
];

// Sample Inventory Items
const inventoryItems = [
  {
    name: "Brake Pads",
    description: "High performance ceramic brake pads",
    category: "Brake System",
    price: 89.99,
    quantity: 50,
    manufacturer: "Brembo",
    compatibleVehicles: [
      {make: "Toyota", model: "Camry", year: 2020},
      {make: "Honda", model: "Accord", year: 2019}
    ],
    images: ["brakepads1.jpg", "brakepads2.jpg"],
    specifications: {
      material: "Ceramic",
      position: "Front",
      warranty: "2 years"
    },
    sku: "BP-2020-001",
    isActive: true,
    warranty: {
      duration: 24,
      description: "Limited warranty against manufacturing defects"
    }
  },
  {
    name: "Oil Filter",
    description: "Premium quality oil filter",
    category: "Filters",
    price: 12.99,
    quantity: 100,
    manufacturer: "Bosch",
    compatibleVehicles: [
      {make: "Ford", model: "F-150", year: 2021},
      {make: "Chevrolet", model: "Silverado", year: 2021}
    ],
    images: ["oilfilter1.jpg"],
    specifications: {
      filterType: "Spin-on",
      threadSize: "3/4-16"
    },
    sku: "OF-2021-002",
    isActive: true,
    warranty: {
      duration: 12,
      description: "1 year warranty"
    }
  },
  {
    name: "Spark Plugs Set",
    description: "Iridium spark plugs for improved performance",
    category: "Engine Parts",
    price: 45.99,
    quantity: 75,
    manufacturer: "NGK",
    compatibleVehicles: [
      {make: "Toyota", model: "Corolla", year: 2021},
      {make: "Honda", model: "Civic", year: 2020}
    ],
    images: ["sparkplugs1.jpg"],
    specifications: {
      material: "Iridium",
      gap: "0.044 inch"
    },
    sku: "SP-2021-003",
    isActive: true,
    warranty: {
      duration: 36,
      description: "3 year warranty"
    }
  },
  {
    name: "Air Filter",
    description: "High-flow air filter",
    category: "Filters",
    price: 29.99,
    quantity: 60,
    manufacturer: "K&N",
    compatibleVehicles: [
      {make: "BMW", model: "3 Series", year: 2022},
      {make: "Mercedes", model: "C-Class", year: 2021}
    ],
    images: ["airfilter1.jpg"],
    specifications: {
      type: "Panel",
      washable: "Yes"
    },
    sku: "AF-2022-004",
    isActive: true,
    warranty: {
      duration: 60,
      description: "Million mile limited warranty"
    }
  }
];

// Sample Fuel Delivery Requests
const fuelDeliveries = [
  {
    userId: "user_id_will_be_replaced",
    fuelType: "Regular",
    quantity: 20,
    deliveryAddress: "789 Pine St, City, State 12345",
    deliveryDate: new Date("2024-02-20"),
    status: "pending",
    price: 65.99,
    paymentStatus: "pending",
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    }
  },
  {
    userId: "user_id_will_be_replaced",
    fuelType: "Premium",
    quantity: 15,
    deliveryAddress: "321 Elm St, City, State 12345",
    deliveryDate: new Date("2024-02-21"),
    status: "completed",
    price: 59.99,
    paymentStatus: "paid",
    coordinates: {
      latitude: 40.7129,
      longitude: -74.0061
    }
  },
  {
    userId: "user_id_will_be_replaced",
    fuelType: "Diesel",
    quantity: 25,
    deliveryAddress: "444 Oak St, City, State 12345",
    deliveryDate: new Date("2024-02-22"),
    status: "in-progress",
    price: 85.99,
    paymentStatus: "paid",
    coordinates: {
      latitude: 40.7130,
      longitude: -74.0062
    }
  },
  {
    userId: "user_id_will_be_replaced",
    fuelType: "Regular",
    quantity: 18,
    deliveryAddress: "555 Maple St, City, State 12345",
    deliveryDate: new Date("2024-02-23"),
    status: "pending",
    price: 62.99,
    paymentStatus: "pending",
    coordinates: {
      latitude: 40.7131,
      longitude: -74.0063
    }
  }
];

// Sample Fuel Pumps
const fuelPumps = [
  {
    location: "Downtown Gas Station",
    address: "100 Main St, City, State 12345",
    coordinates: {
      latitude: 40.7130,
      longitude: -74.0062
    },
    fuelTypes: ["Regular", "Premium", "Diesel"],
    status: "operational",
    capacity: 1000,
    currentLevel: 750
  },
  {
    location: "Highway Fuel Stop",
    address: "500 Highway 1, City, State 12345",
    coordinates: {
      latitude: 40.7131,
      longitude: -74.0063
    },
    fuelTypes: ["Regular", "Premium"],
    status: "operational",
    capacity: 800,
    currentLevel: 600
  },
  {
    location: "Suburban Gas Station",
    address: "200 Park Rd, City, State 12345",
    coordinates: {
      latitude: 40.7132,
      longitude: -74.0064
    },
    fuelTypes: ["Regular", "Premium", "Diesel", "E85"],
    status: "operational",
    capacity: 1200,
    currentLevel: 900
  },
  {
    location: "Express Fuel Station",
    address: "300 Express Way, City, State 12345",
    coordinates: {
      latitude: 40.7133,
      longitude: -74.0065
    },
    fuelTypes: ["Regular", "Premium"],
    status: "maintenance",
    capacity: 600,
    currentLevel: 200
  }
];

// Seed the database
async function seedDatabase() {
  try {
    // Clear existing data
    await mongoose.connection.dropDatabase();
    
    // Insert Users
    const createdUsers = await User.insertMany(users);
    console.log('Users seeded successfully');

    // Update fuel delivery user IDs with created user IDs
    fuelDeliveries.forEach((delivery, index) => {
      delivery.userId = createdUsers[index % createdUsers.length]._id;
    });

    // Insert other data
    await InventoryItem.insertMany(inventoryItems);
    await FuelDelivery.insertMany(fuelDeliveries);
    await FuelPump.insertMany(fuelPumps);

    console.log('Database seeded successfully');
    
    // Close the connection after seeding
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();

