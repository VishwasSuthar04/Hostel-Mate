const router = require('express').Router()
const auth = require('../middlewares/auth')
const { getBudget, setBudget, generatePlan, updatePlan } = require('../controllers/budgetController')
router.use(auth)
router.get('/', getBudget)
router.put('/', setBudget)
router.post('/generate-plan', generatePlan)
router.put('/plan', updatePlan)
module.exports = router
