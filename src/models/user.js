const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email address: ' + value)
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoUrl: {
      type: String,
      default: 'https://geographyandyou.com/images/user-profile.png',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Invalid Photo URL: ' + value)
        }
      },
    },
    about: {
      type: String,
      default: 'This is a default about of the user!',
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
)

// /** 🔹 **Middleware to Hash Password Before Saving a New User** */
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10)
//   }
//   next()
// })

/** 🔹 **Method to Generate JWT Token** */
userSchema.methods.getJWT = async function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

/** 🔹 **Method to Validate Password** */
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return bcrypt.compare(passwordInputByUser, this.password)
}

module.exports = mongoose.model('User', userSchema)
