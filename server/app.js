const dotenv =require('dotenv');
dotenv.config();
const cors=require('cors');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extened:true}));
app.use(cookieParser());

 
connectToDb();

app.get('/',(req,res)=>{
    res.send('hello world');
});

// app.use('/users',userRoutes);
// app.use('/captains',captainRoutes);

module.exports = app;