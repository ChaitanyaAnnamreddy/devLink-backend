const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://dev-link:bLwhydQN1mSD0x2I@cluster0.kmbym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
