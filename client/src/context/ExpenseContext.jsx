import { createContext, useContext, useState, useCallback } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const ExpenseContext = createContext(null)

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)

  const fetchExpenses = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const { data } = await api.get('/expenses', { params })
      setExpenses(data.expenses)
    } catch (e) { toast.error('Failed to load expenses') }
    finally { setLoading(false) }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/expenses/stats')
      setStats(data)
    } catch {}
  }, [])

  const addExpense = async (payload) => {
    const { data } = await api.post('/expenses', payload)
    setExpenses(prev => [data.expense, ...prev])
    toast.success('Expense added ✓')
    if (data.alert) {
      const icon = data.alert.type === 'budget_exceeded' ? '🚨' : data.alert.type === 'category_exceeded' ? '⚠️' : '💡'
      toast(`${icon} ${data.alert.message}`, { duration: 5000, icon: '📊' })
    }
    return data.expense
  }

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`)
    setExpenses(prev => prev.filter(e => e._id !== id))
    toast.success('Expense deleted')
  }

  return (
    <ExpenseContext.Provider value={{ expenses, loading, stats, fetchExpenses, fetchStats, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  )
}

export const useExpenses = () => useContext(ExpenseContext)
