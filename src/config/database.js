const mongoose = require('mongoose')

const connectDB = async () => {
  console.log(process.env.DB_CONNECTION_SECRET)
  await mongoose.connect(
    'mongodb+srv://dev-link:rr4voCFiPmurcTYj@cluster0.kmbym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
}

module.exports = connectDB
