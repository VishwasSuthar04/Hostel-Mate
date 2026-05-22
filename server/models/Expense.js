const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group:       { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  description: { type: String, required: true, trim: true },
  amount:      { type: Number, required: true, min: 0 },
  category:    { type: String, enum: ['food','rent','utilities','transport','groceries','internet','medical','dining','shopping','entertain','education','fitness','subscription','insurance','savings','other'], default: 'other' },
  date:        { type: Date, default: Date.now },
  notes:       { type: String, default: '' },
  isShared:    { type: Boolean, default: false },
  splitWith:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

module.exports = mongoose.model('Expense', expenseSchema)
