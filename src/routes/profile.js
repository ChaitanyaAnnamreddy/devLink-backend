const express = require('express')
const profileRouter = express.Router()

const { userAuth } = require('../middlewares/auth')
const { validateEditProfileData } = require('../utils/validation')

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user
    res.send(user)
  } catch (err) {
    console.error('Profile view error:', err.message)
    res.status(400).json({ error: err.message })
  }
})

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    console.log('📩 Received Request Body:', JSON.stringify(req.body, null, 2)) // ✅ Debugging

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error('Invalid request: No data provided')
    }

    // ✅ Check what is causing validation failure
    const isValid = validateEditProfileData(req)
    console.log('🔍 Validation Result:', isValid) // ✅ Log validation result

    if (!isValid) {
      throw new Error('Invalid Edit Request')
    }

    const loggedInUser = req.user
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        loggedInUser[key] = req.body[key]
      }
    })

    await loggedInUser.save()

    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      data: loggedInUser,
    })
  } catch (err) {
    console.error('❌ Profile update error:', err.message)
    res.status(400).json({ error: err.message })
  }
})

module.exports = profileRouter
