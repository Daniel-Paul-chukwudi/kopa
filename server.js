require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT 
const DB = process.env.DB
const cors = require('cors')
const mongoose = require("mongoose")
const creatorRouter = require('./route/creatorRoute')
const paymentRouter = require('./route/paymentRoute')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi  = require('swagger-ui-express')



const app = express()
app.use(express.json())
app.use(cors())

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation for TrustForge',
    version: '4.1.9',
    description: 'Swagger documentation for the TrustForge backend',
    contact: {
      name: 'KOPA Support',
      url: 'https://google.com',
    },
  },
  servers: [
    {
      url: 'https://kopa-39h4.onrender.com/',
      description: 'Production server',
    },
    {
      url: 'http://localhost:6969',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token as **Bearer <token>**',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./route/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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