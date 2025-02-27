const express = require('express')
const userRouter = express.Router()

const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills'

// Get all the pending connection request for the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', USER_SAFE_DATA)
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: 'Data fetched successfully',
      data: connectionRequests,
    })
  } catch (err) {
    req.statusCode(400).send('ERROR: ' + err.message)
  }
})

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })
      .populate('fromUserId', USER_SAFE_DATA)
      .populate('toUserId', USER_SAFE_DATA)
      .skip(skip)
      .limit(limit)

    console.log(connectionRequests)

    const totalConnections = await ConnectionRequest.countDocuments({
      $or: [
        { toUserId: loggedInUser._id, status: 'accepted' },
        { fromUserId: loggedInUser._id, status: 'accepted' },
      ],
    })

    const data = connectionRequests.map((row) => {
      return row.fromUserId._id.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId
    })

    res.json({
      data,
      totalConnections,
      currentPage: page,
      totalPages: Math.ceil(totalConnections / limit),
    })
  } catch (err) {
    res.status(400).send({ message: err.message })
  }
})

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    const page = parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit > 50 ? 50 : limit
    const skip = (page - 1) * limit

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select('fromUserId  toUserId')

    const hideUsersFromFeed = new Set()
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString())
      hideUsersFromFeed.add(req.toUserId.toString())
    })

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit)

    res.json({ data: users })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

userRouter.delete('/user/delete', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user

    // Delete the user from the database
    await User.findByIdAndDelete(loggedInUser._id)

    // Optionally, remove all related connection requests
    await ConnectionRequest.deleteMany({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })

    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting account', error: err.message })
  }
})

module.exports = userRouter
