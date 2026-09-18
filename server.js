require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT 
const DB = process.env.DB
const cors = require('cors')
const mongoose = require("mongoose")
const creatorRouter = require('./route/creatorRoute')
const paymentRouter = require('./route/paymentRoute')



const app = express()
app.use(express.json())
app.use(cors())

app.use(creatorRouter)
app.use(paymentRouter)


const Startserver = async ()=>{ 
  mongoose.connect(DB).then(() => {
    console.log('Connected to Database')
    app.listen(PORT, () => {
      console.log('Server is running on Port:', PORT)
    })
  }).catch((error) => {
    console.log('Error connecting to Database', error.message)
  });
};

Startserver();