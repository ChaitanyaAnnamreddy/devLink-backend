const validator = require('validator')

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body
  if (!firstName || !lastName) {
    throw new Error('Name is not valid!')
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid!')
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong Password!')
  }
}

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'emailId',
    'photoUrl',
    'gender',
    'age',
    'about',
    'skills',
  ]

  const requestKeys = Object.keys(req.body)

  // ✅ Check if all request fields are allowed
  const isEditAllowed = requestKeys.every((field) =>
    allowedEditFields.includes(field)
  )

  if (!isEditAllowed) {
    console.log('❌ Invalid field(s) detected:', requestKeys)
    return false
  }

  // ✅ Validate field values
  const { firstName, lastName, emailId, photoUrl, gender, age, about, skills } =
    req.body

  if (firstName && firstName.length < 3) {
    console.log('❌ Validation failed: First name is too short')
    return false
  }

  if (emailId && !validator.isEmail(emailId)) {
    console.log('❌ Validation failed: Invalid email')
    return false
  }

  if (age && isNaN(age)) {
    console.log('❌ Validation failed: Age is not a number')
    return false
  }

  if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase())) {
    console.log('❌ Validation failed: Invalid gender')
    return false
  }

  if (skills && !Array.isArray(skills)) {
    console.log('❌ Validation failed: Skills must be an array')
    return false
  }

  if (photoUrl && !validator.isURL(photoUrl)) {
    console.log('❌ Validation failed: Invalid photo URL')
    return false
  }

  console.log('✅ Validation Passed!')
  return true
}

module.exports = {
  validateSignUpData,
  validateEditProfileData,
}
