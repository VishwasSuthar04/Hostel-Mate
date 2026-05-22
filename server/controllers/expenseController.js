const Expense = require('../models/Expense')
const Budget = require('../models/Budget')

exports.getExpenses = async (req, res) => {
  try {
    const { limit = 50, category, search } = req.query
    const query = { user: req.user._id }
    if (category && category !== 'all') query.category = category
    if (search) query.description = { $regex: search, $options: 'i' }
    const expenses = await Expense.find(query).sort({ date: -1 }).limit(Number(limit))
    res.json({ expenses })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.createExpense = async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user._id })
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const budget = await Budget.findOne({ user: req.user._id, month })
    let alert = null
    if (budget && budget.monthlyBudget > 0) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const spent = await Expense.aggregate([
        { $match: { user: req.user._id, date: { $gte: startOfMonth } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ])
      const totalSpent = spent.reduce((s, e) => s + e.total, 0)
      const planItem = budget.plan.find(p => p.category === req.body.category)
      const categorySpent = spent.find(s => s._id === req.body.category)?.total || req.body.amount
      if (totalSpent > budget.monthlyBudget) {
        alert = { type: 'budget_exceeded', message: `You've exceeded your monthly budget of Rs.${budget.monthlyBudget.toLocaleString()}!` }
      } else if (planItem && planItem.allocated > 0 && categorySpent > planItem.allocated) {
        alert = { type: 'category_exceeded', message: `You've exceeded your "${req.body.category}" budget plan!` }
      } else if (totalSpent > budget.monthlyBudget * 0.8) {
        alert = { type: 'budget_warning', message: `You've used ${Math.round(totalSpent / budget.monthlyBudget * 100)}% of your monthly budget.` }
      }
    }
    res.status(201).json({ expense, alert })
  } catch (err) { res.status(400).json({ message: err.message }) }
}

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!expense) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [total, thisMonth, lastMonth, byCategory] = await Promise.all([
      Expense.aggregate([{ $match: { user: userId } }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
      Expense.aggregate([{ $match: { user: userId, date: { $gte: startOfMonth } } }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
      Expense.aggregate([{ $match: { user: userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
      Expense.aggregate([{ $match: { user: userId, date: { $gte: startOfMonth } } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }, { $sort: { total: -1 } }]),
    ])

    res.json({
      total: total[0]?.sum || 0,
      thisMonth: thisMonth[0]?.sum || 0,
      lastMonth: lastMonth[0]?.sum || 0,
      byCategory,
      groupCount: 0,
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getMonthly = async (req, res) => {
  try {
    const monthly = await Expense.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' } }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ])
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    res.json({ monthly: monthly.map(m => ({ month: `${months[m._id.month - 1]} ${m._id.year}`, total: m.total })) })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
