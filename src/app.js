const express = require('express')
const connectDB = require('./config/database')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')

require('dotenv').config()
require('./utils/cronjob')

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://devcircle-hub.netlify.app'],
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://devcircle-hub.netlify.app',
  ]
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())

// Routes
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')
const paymentRouter = require('./routes/payment')
const initializeSocket = require('./utils/socket')
const chatRouter = require('./routes/chat')
const passwordupdateRouter = require('./routes/passwordupdate')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
app.use('/', paymentRouter)
app.use('/', chatRouter)
app.use('/', passwordupdateRouter)

// Start Server
const server = http.createServer(app)
initializeSocket(server)

connectDB()
  .then(() => {
    console.log('✅ Database connection established...')
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT || 5000}...`)
    })
  })
  .catch((err) => {
    console.error('❌ Database connection failed!', err)
  })
