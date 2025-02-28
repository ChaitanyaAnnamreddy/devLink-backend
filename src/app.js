const express = require('express')
const connectDB = require('./config/database')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const http = require('http')

require('dotenv').config()

require('./utils/cronjob')

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')
// const paymentRouter = require('./routes/payment')
const initializeSocket = require('./utils/socket')
const chatRouter = require('./routes/chat')
const passwordupdateRouter = require('./routes/passwordupdate')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
// app.use('/', paymentRouter)
app.use('/', chatRouter)
app.use('/', passwordupdateRouter)

const server = http.createServer(app)
initializeSocket(server)

connectDB()
  .then(() => {
    console.log('Database connection established...')
    server.listen(process.env.PORT, '0.0.0.0', () => {
      console.log(
        `Server is successfully listening on port ${process.env.PORT}...`
      )
    })
  })
  .catch((err) => {
    console.error('Database cannot be connected!!', err.message)
  })
