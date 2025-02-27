const bcrypt = require('bcrypt')

const profileRouter = require('express').Router()

const { userAuth } = require('../middlewares/auth')
const { validateEditProfileData } = require('../utils/validation')

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: 'Current and new passwords are required' })
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: 'New password cannot be the same as the current password',
      })
    }

    const loggedInUser = req.user

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, loggedInUser.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10) // 10 is the salt rounds
    loggedInUser.password = hashedPassword

    // Save the updated user
    await loggedInUser.save()

    res.json({
      message: `${loggedInUser.firstName}, your password was updated successfully 🎉`,
    })
  } catch (err) {
    console.error('Password update error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = profileRouter
