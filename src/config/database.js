const mongoose = require('mongoose')

const connectDB = async () => {
  console.log('🚀 Connecting to MongoDB...')
  await mongoose.connect(
    'mongodb+srv://dev-link:aoIKKXkDtbxWZXHf@cluster0.kmbym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
}

module.exports = connectDB
