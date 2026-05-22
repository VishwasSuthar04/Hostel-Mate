const router = require('express').Router()
const auth = require('../middlewares/auth')
const { register, login, getMe, updateProfile, uploadAvatar } = require('../controllers/authController')
router.post('/register', register)
router.post('/login', login)
router.get('/me', auth, getMe)
router.put('/profile', auth, updateProfile)
router.post('/avatar', auth, uploadAvatar)
module.exports = router
