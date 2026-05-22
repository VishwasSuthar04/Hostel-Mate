import { createContext, useContext, useState, useCallback } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const BudgetContext = createContext(null)

export function BudgetProvider({ children }) {
  const [budget, setBudget] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchBudget = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/budget')
      setBudget(data)
    } catch { }
    finally { setLoading(false) }
  }, [])

  const setMonthlyBudget = async (monthlyBudget) => {
    const { data } = await api.put('/budget', { monthlyBudget })
    setBudget(prev => ({ ...prev, monthlyBudget, remaining: monthlyBudget - (prev?.totalSpent || 0) }))
    toast.success('Monthly budget set!')
    return data
  }

  const generatePlan = async () => {
    try {
      const { data } = await api.post('/budget/generate-plan')
      setBudget(data)
      toast.success('Monthly plan generated!')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Set a budget first')
      throw err
    }
  }

  const updatePlan = async (plan) => {
    await api.put('/budget/plan', { plan })
    setBudget(prev => {
      if (!prev) return prev
      const newPlan = prev.plan.map(p => {
        const updated = plan.find(up => up.category === p.category)
        return updated ? { ...p, allocated: updated.allocated } : p
      })
      return { ...prev, plan: newPlan }
    })
    toast.success('Plan updated!')
  }

  return (
    <BudgetContext.Provider value={{ budget, loading, fetchBudget, setMonthlyBudget, generatePlan, updatePlan }}>
      {children}
    </BudgetContext.Provider>
  )
}

export const useBudget = () => useContext(BudgetContext)
