import { useEffect, useState } from 'react'
import { useBudget } from '../context/BudgetContext'
import { formatPKR, getCategoryById } from '../utils/helpers'
import { Wallet, Sparkles, Save, AlertTriangle, CheckCircle, PiggyBank, Target, TrendingDown, Pizza, Building2, Zap, Bus, ShoppingCart, Wifi, Pill, UtensilsCrossed, ShoppingBag, Clapperboard, BookOpen, Dumbbell, Smartphone, Shield, Package } from 'lucide-react'

const CATEGORY_ICONS = {
  food: Pizza, rent: Building2, utilities: Zap, transport: Bus,
  groceries: ShoppingCart, internet: Wifi, medical: Pill, dining: UtensilsCrossed,
  shopping: ShoppingBag, entertain: Clapperboard, education: BookOpen,
  fitness: Dumbbell, subscription: Smartphone, insurance: Shield,
  savings: PiggyBank, other: Package,
}

export default function Budget() {
  const { budget, fetchBudget, setMonthlyBudget, generatePlan, updatePlan } = useBudget()
  const [monthlyInput, setMonthlyInput] = useState('')
  const [editing, setEditing] = useState(false)
  const [editPlan, setEditPlan] = useState([])

  useEffect(() => { fetchBudget() }, [])

  useEffect(() => {
    if (budget) {
      setMonthlyInput(budget.monthlyBudget?.toString() || '')
      setEditPlan(budget.plan?.map(p => ({ ...p })) || [])
    }
  }, [budget])

  const handleSetBudget = async (e) => {
    e.preventDefault()
    const amt = Number(monthlyInput)
    if (amt > 0) await setMonthlyBudget(amt)
  }

  const handleGenerate = async () => {
    await generatePlan()
    setEditing(true)
  }

  const handleUpdatePlan = async () => {
    await updatePlan(editPlan.map(p => ({ category: p.category, allocated: p.allocated })))
    setEditing(false)
  }

  const updateAllocation = (category, value) => {
    setEditPlan(prev => prev.map(p => p.category === category ? { ...p, allocated: Number(value) } : p))
  }

  const totalAllocated = editPlan.reduce((s, p) => s + p.allocated, 0)

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
            <PiggyBank size={18} className="text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-surface-900">Budget & Plan</h1>
        </div>
        <p className="text-xs text-surface-400 font-urdu mt-0.5 ml-11">بجٹ اور منصوبہ</p>
      </div>

      {/* Set monthly budget */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-sm shadow-brand-200/50">
            <Target size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-surface-900">Monthly Budget</h2>
            <p className="text-xs text-surface-400">Set your total monthly spending limit</p>
          </div>
        </div>
        <form onSubmit={handleSetBudget} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Total Monthly Budget (PKR)</label>
            <input type="number" value={monthlyInput} onChange={e => setMonthlyInput(e.target.value)}
              className="input text-lg font-semibold" placeholder="e.g. 50000" min="1" required />
          </div>
          <button type="submit" className="btn-primary !px-6">Save</button>
        </form>
        {budget?.monthlyBudget > 0 && (
          <div className="mt-4 p-3.5 bg-gradient-to-r from-emerald-50 to-green-50/50 rounded-xl border border-emerald-100/80">
            <p className="text-sm text-emerald-700 font-semibold flex items-center gap-2">
              <CheckCircle size={15} />
              Current budget: {formatPKR(budget.monthlyBudget)}
            </p>
          </div>
        )}
      </div>

      {/* Budget overview */}
      {budget && budget.monthlyBudget > 0 && (
        <>
          <div className="card p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-surface-100 rounded-lg flex items-center justify-center">
                  <TrendingDown size={15} className="text-surface-500" />
                </div>
                <h2 className="font-semibold text-surface-900">This Month</h2>
              </div>
              <span className="text-xs font-mono text-surface-400 bg-surface-100 px-2.5 py-1 rounded-lg">{budget.month}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center p-4 bg-gradient-to-b from-brand-50 to-brand-50/50 rounded-xl border border-brand-100/50">
                <p className="text-lg md:text-xl font-bold text-brand-700">{formatPKR(budget.monthlyBudget)}</p>
                <p className="text-[11px] text-surface-500 mt-0.5">Budget</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-red-50 to-red-50/50 rounded-xl border border-red-100/50">
                <p className="text-lg md:text-xl font-bold text-red-600">{formatPKR(budget.totalSpent)}</p>
                <p className="text-[11px] text-surface-500 mt-0.5">Spent</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-emerald-50 to-emerald-50/50 rounded-xl border border-emerald-100/50">
                <p className="text-lg md:text-xl font-bold text-emerald-600">{formatPKR(Math.max(budget.remaining, 0))}</p>
                <p className="text-[11px] text-surface-500 mt-0.5">Remaining</p>
              </div>
            </div>
            {budget.overspent && (
              <div className="flex items-center gap-2.5 p-3.5 bg-gradient-to-r from-red-50 to-red-50/50 rounded-xl border border-red-200/80 animate-slide-up">
                <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">You've exceeded your monthly budget!</p>
              </div>
            )}
          </div>

          {/* Generate Plan */}
          <div className="card p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-sm shadow-yellow-200/50">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-surface-900">Monthly Plan</h2>
                  <p className="text-xs text-surface-400">Category-wise spending allocation</p>
                </div>
              </div>
              <button onClick={handleGenerate} className="btn-secondary text-sm flex items-center gap-1.5 !py-2">
                <Sparkles size={13} /> Generate
              </button>
            </div>

            {budget.plan && budget.plan.some(p => p.allocated > 0) && (
              <div className="space-y-0 divide-y divide-surface-100">
                {editPlan.filter(p => p.allocated > 0).map((p, i) => {
                  const cat = getCategoryById(p.category)
                  const Icon = CATEGORY_ICONS[cat?.id] || Package
                  const remaining = p.allocated - p.spent
                  const pct = p.allocated > 0 ? Math.min((p.spent / p.allocated) * 100, 100) : 0
                  return (
                    <div key={p.category} className="py-3 first:pt-0 last:pb-0 animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center"><Icon size={18} /></span>
                          <span className="text-sm font-medium text-surface-700">{cat?.labelEn}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {editing ? (
                            <input type="number" value={p.allocated}
                              onChange={e => updateAllocation(p.category, e.target.value)}
                              className="w-20 px-2 py-1 text-xs rounded-lg border border-surface-200 text-right" min="0" />
                          ) : (
                            <span className="text-sm font-semibold text-surface-900">{formatPKR(p.allocated)}</span>
                          )}
                          {!editing && (
                            <span className="text-xs font-medium text-surface-400 w-16 text-right">{formatPKR(p.spent)}</span>
                          )}
                        </div>
                      </div>
                      {!editing && p.allocated > 0 && (
                        <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full rounded-full transition-all duration-500 ${
                            p.overspent ? 'bg-gradient-to-r from-red-500 to-red-400'
                              : pct > 80 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                                : 'bg-gradient-to-r from-brand-500 to-brand-400'
                          }`} style={{ width: `${pct}%` }} />
                        </div>
                      )}
                      {!editing && (
                        <p className={`text-[11px] mt-1 font-medium ${p.overspent ? 'text-red-500' : pct > 80 ? 'text-yellow-600' : 'text-surface-400'}`}>
                          {p.overspent
                            ? `Overspent by ${formatPKR(Math.abs(remaining))}`
                            : `${formatPKR(remaining)} left`}
                        </p>
                      )}
                    </div>
                  )
                })}

                <div className="pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-surface-900">Total Allocated</span>
                  <span className="text-sm font-bold text-brand-600">{formatPKR(totalAllocated)}</span>
                </div>

                {editing && (
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setEditing(false)} className="btn-secondary flex-1">Cancel</button>
                    <button onClick={handleUpdatePlan} className="btn-primary flex-1 flex items-center justify-center gap-1.5">
                      <Save size={14} /> Save Plan
                    </button>
                  </div>
                )}
              </div>
            )}

            {(!budget.plan || budget.plan.every(p => p.allocated === 0)) && (
              <div className="flex flex-col items-center py-10 text-surface-400">
                <p className="text-4xl mb-3 opacity-50">📊</p>
                <p className="text-sm">No plan yet</p>
                <p className="text-xs mt-1">Click "Generate" to create one based on your history</p>
              </div>
            )}
          </div>
        </>
      )}

      {(!budget || !budget.monthlyBudget) && (
        <div className="flex flex-col items-center py-16 text-surface-400">
          <p className="text-5xl mb-4 opacity-50">🎯</p>
          <p className="text-sm font-medium">Set your monthly budget above to get started</p>
        </div>
      )}
    </div>
  )
}
