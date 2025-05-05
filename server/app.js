const dotenv =require('dotenv');
dotenv.config();
const cors=require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const fuelPumpRoutes = require('./routes/fuelPump.routes'); 
const deliveryBoyRoutes = require('./routes/deliveryBoy.routes');
const inventoryRoutes = require('./routes/inventory.routes')
const orderRoutes = require('./routes/order.routes');
const fuelOrderRoutes = require('./routes/fuelOrder.routes');
const mapRoutes = require('./routes/maps.routes')


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

 
connectToDb();

app.get('/',(req,res)=>{
    res.send('hello world');
});

app.use('/users',userRoutes);
app.use('/fuelpumps',fuelPumpRoutes);
app.use('/deliveryBoys',deliveryBoyRoutes);
app.use('/inventory',inventoryRoutes);
app.use('/maps',mapRoutes);
app.use('/orders',orderRoutes)
app.use('/fuel-orders',fuelOrderRoutes)

module.exports = app;