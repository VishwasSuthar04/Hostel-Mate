const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month:         { type: String, required: true },
  monthlyBudget: { type: Number, default: 0 },
  plan:          [{
    category: { type: String, required: true },
    allocated: { type: Number, default: 0 },
  }],
}, { timestamps: true })

budgetSchema.index({ user: 1, month: 1 }, { unique: true })

module.exports = mongoose.model('Budget', budgetSchema)
