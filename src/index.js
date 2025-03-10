const express = require('express');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { connectDB } = require('../model/connectDB');
const userRoutes  = require('../routes/userRoutes');
const contentRoutes = require('../routes/contentRoutes')
const linkRoutes = require('../routes/linkRoutes')
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json())
connectDB()

const corsOptions= {
  origin: process.env.FE_URL,
  methods: ["POST", "GET", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))

app.get('/', (req,res)=>{res.json({message: "Hello from Vercel"})})
app.use("/api/v1/user", userRoutes)
app.use("/api/v1", contentRoutes)
app.use("/api/v1/brain", linkRoutes)


module.exports = app;