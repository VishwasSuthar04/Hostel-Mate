const router = require('express').Router()
const auth = require('../middlewares/auth')
const { getInsights } = require('../controllers/aiController')
router.use(auth)
router.post('/insights', getInsights)
module.exports = router
