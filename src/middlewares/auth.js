const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies
    console.log('🔑 Received Token:', token) // 👈 Log the token received in backend

    if (!token) {
      return res.status(401).send('Please Login!')
    }

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET)
    console.log('✅ Decoded Token:', decodedObj) // 👈 Log decoded token

    const { _id } = decodedObj
    const user = await User.findById(_id)
    if (!user) {
      throw new Error('User not found')
    }

    req.user = user
    next()
  } catch (err) {
    console.error('❌ Authentication Error:', err.message)
    res.status(400).send('ERROR: ' + err.message)
  }
}

module.exports = { userAuth }
