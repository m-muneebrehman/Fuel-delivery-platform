const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const fuelPumpRoutes = require("./routes/fuelPump.routes");
const deliveryBoyRoutes = require("./routes/deliveryBoy.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const orderRoutes = require('./routes/order.routes');
const fuelOrderRoutes = require('./routes/fuelOrder.routes');
const mapRoutes = require('./routes/maps.routes')

app.use(
  cors({
    origin: "http://localhost:5173", // exact origin of your frontend
    credentials: true, // allow cookies to be sent
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


connectToDb();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/users", userRoutes);
app.use("/fuelpumps", fuelPumpRoutes);
app.use("/deliveryBoys", deliveryBoyRoutes);
app.use("/inventory", inventoryRoutes);
app.use('/maps',mapRoutes);
app.use('/orders',orderRoutes)
app.use('/fuel-orders',fuelOrderRoutes)

module.exports = app;
