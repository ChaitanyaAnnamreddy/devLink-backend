const mongoose = require('mongoose')

const connectDB = async () => {
  console.log('🚀 Connecting to MongoDB...')
  await mongoose.connect(
    'mongodb+srv://dev-link:bLwhydQN1mSD0x2I@cluster0.kmbym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
}

module.exports = connectDB
