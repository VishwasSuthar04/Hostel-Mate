const Expense = require('../models/Expense')
const axios = require('axios')

exports.getInsights = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 }).limit(100)
    const expenseData = expenses.map(e => ({ amount: e.amount, category: e.category, date: e.date }))

    try {
      const aiRes = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, { expenses: expenseData }, { timeout: 10000 })
      return res.json(aiRes.data)
    } catch {
      // Fallback basic insights
      const total = expenseData.reduce((s, e) => s + e.amount, 0)
      const byCategory = expenseData.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc }, {})
      const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]

      res.json({
        insights: [
          `You have spent Rs.${total.toLocaleString()} in total.`,
          topCategory ? `Your highest spending category is "${topCategory[0]}" at Rs.${topCategory[1].toLocaleString()}.` : null,
          expenses.length < 5 ? 'Add more expenses to get better insights.' : null,
        ].filter(Boolean),
        recommendations: [
          'Try to set a monthly budget for each category.',
          'Track daily expenses to identify small but frequent spending.',
          'Consider splitting large bills with roommates using Groups feature.',
        ]
      })
    }
  } catch (err) { res.status(500).json({ message: err.message }) }
}
