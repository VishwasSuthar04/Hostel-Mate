const jwt = require('jsonwebtoken')
const User = require('../models/User')
const multer = require('multer')
const path = require('path')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `avatar-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
})
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'), false)
  cb(null, true)
} })

exports.uploadAvatar = async (req, res) => {
  upload.single('avatar')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message })
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    try {
      const avatarUrl = `/uploads/${req.file.filename}`
      const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl }, { new: true })
      res.json({ user, avatar: avatarUrl })
    } catch (err) { res.status(500).json({ message: err.message }) }
  })
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, city } = req.body
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' })
    const user = await User.create({ name, email, password, city })
    res.status(201).json({ token: signToken(user._id), user })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !await user.comparePassword(password)) return res.status(401).json({ message: 'Invalid credentials' })
    res.json({ token: signToken(user._id), user })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getMe = async (req, res) => res.json({ user: req.user })

exports.updateProfile = async (req, res) => {
  try {
    const { name, city } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, { name, city }, { new: true })
    res.json({ user })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
