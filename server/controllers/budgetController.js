const Budget = require('../models/Budget')
const Expense = require('../models/Expense')
const { CATEGORIES } = require('../utils/categories')

exports.getBudget = async (req, res) => {
  try {
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    let budget = await Budget.findOne({ user: req.user._id, month })
    if (!budget) {
      budget = await Budget.create({ user: req.user._id, month, plan: CATEGORIES.map(c => ({ category: c.id, allocated: 0 })) })
    }
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const spent = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: startOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ])

    const spentMap = {}
    spent.forEach(s => { spentMap[s._id] = s.total })

    const planWithSpent = budget.plan.map(p => ({
      category: p.category,
      allocated: p.allocated,
      spent: spentMap[p.category] || 0,
      remaining: p.allocated - (spentMap[p.category] || 0),
      overspent: (spentMap[p.category] || 0) > p.allocated && p.allocated > 0,
    }))

    const totalSpent = spent.reduce((sum, s) => sum + s.total, 0)
    const totalBudget = budget.monthlyBudget

    res.json({
      month,
      monthlyBudget: totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      overspent: totalBudget > 0 && totalSpent > totalBudget,
      plan: planWithSpent,
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.setBudget = async (req, res) => {
  try {
    const { monthlyBudget } = req.body
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    let budget = await Budget.findOne({ user: req.user._id, month })
    if (!budget) {
      budget = await Budget.create({ user: req.user._id, month, plan: CATEGORIES.map(c => ({ category: c.id, allocated: 0 })) })
    }
    budget.monthlyBudget = monthlyBudget
    await budget.save()
    res.json({ monthlyBudget: budget.monthlyBudget, month })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.generatePlan = async (req, res) => {
  try {
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    let budget = await Budget.findOne({ user: req.user._id, month })
    if (!budget) {
      budget = await Budget.create({ user: req.user._id, month, plan: CATEGORIES.map(c => ({ category: c.id, allocated: 0 })) })
    }

    if (!budget.monthlyBudget) {
      return res.status(400).json({ message: 'Set a monthly budget first' })
    }

    const totalBudget = budget.monthlyBudget

    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    const historical = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: threeMonthsAgo } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ])

    const grandTotal = historical.reduce((s, h) => s + h.total, 0)

    if (grandTotal === 0) {
      const defaultPercentages = {
        food: 0.30, rent: 0.25, utilities: 0.10, transport: 0.10,
        groceries: 0.05, internet: 0.03, medical: 0.03, dining: 0.03,
        shopping: 0.03, entertain: 0.02, education: 0.02, fitness: 0.01,
        subscription: 0.01, insurance: 0.01, savings: 0.01, other: 0.01,
      }
      budget.plan = CATEGORIES.map(c => ({
        category: c.id,
        allocated: Math.round(totalBudget * (defaultPercentages[c.id] || 0.01)),
      }))
    } else {
      budget.plan = CATEGORIES.map(c => {
        const hist = historical.find(h => h._id === c.id)
        const ratio = hist ? hist.total / grandTotal : 0.01
        return { category: c.id, allocated: Math.round(totalBudget * ratio) }
      })
    }

    await budget.save()

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const spent = await Expense.aggregate([
      { $match: { user: req.user._id, date: { $gte: startOfMonth } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ])
    const spentMap = {}
    spent.forEach(s => { spentMap[s._id] = s.total })

    const planWithSpent = budget.plan.map(p => ({
      category: p.category,
      allocated: p.allocated,
      spent: spentMap[p.category] || 0,
      remaining: p.allocated - (spentMap[p.category] || 0),
      overspent: (spentMap[p.category] || 0) > p.allocated && p.allocated > 0,
    }))

    const totalSpent = spent.reduce((sum, s) => sum + s.total, 0)

    res.json({
      month,
      monthlyBudget: totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      overspent: totalBudget > 0 && totalSpent > totalBudget,
      plan: planWithSpent,
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.updatePlan = async (req, res) => {
  try {
    const { plan } = req.body
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    let budget = await Budget.findOne({ user: req.user._id, month })
    if (!budget) {
      budget = await Budget.create({ user: req.user._id, month, plan: CATEGORIES.map(c => ({ category: c.id, allocated: 0 })) })
    }

    plan.forEach(p => {
      const existing = budget.plan.find(bp => bp.category === p.category)
      if (existing) existing.allocated = p.allocated
    })

    await budget.save()
    res.json({ message: 'Plan updated' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
