require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/expenses', require('./routes/expenseRoutes'))
app.use('/api/groups', require('./routes/groupRoutes'))
app.use('/api/budget', require('./routes/budgetRoutes'))
app.use('/api/ai', require('./routes/aiRoutes'))

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'HostelMate API' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hostelmate'

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch(err => { console.error('MongoDB error:', err); process.exit(1) })
