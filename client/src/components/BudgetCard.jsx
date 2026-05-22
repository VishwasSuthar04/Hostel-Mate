import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBudget } from '../context/BudgetContext'
import { formatPKR } from '../utils/helpers'
import { Wallet, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

export default function BudgetCard() {
  const { budget, fetchBudget } = useBudget()

  useEffect(() => { fetchBudget() }, [])

  if (!budget || !budget.monthlyBudget) return null

  const pct = budget.monthlyBudget > 0 ? Math.min((budget.totalSpent / budget.monthlyBudget) * 100, 100) : 0
  const barColor = pct >= 100 ? 'from-red-500 to-red-400' : pct > 80 ? 'from-yellow-500 to-yellow-400' : 'from-brand-500 to-brand-400'

  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-sm shadow-brand-200/50">
            <Wallet size={16} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-surface-900 text-sm">Monthly Budget</h2>
            <p className="text-[10px] text-surface-400 font-urdu">ماہانہ بجٹ</p>
          </div>
        </div>
        <Link to="/budget" className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700 transition-colors">
          Manage <ArrowRight size={12} />
        </Link>
      </div>

      <div className="flex items-end justify-between mb-2">
        <p className="text-xl font-bold text-surface-900">{formatPKR(budget.totalSpent)}</p>
        <p className="text-xs text-surface-400">of {formatPKR(budget.monthlyBudget)}</p>
      </div>

      <div className="w-full h-3 bg-surface-100 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }} />
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs font-medium text-surface-400">{Math.round(pct)}% used</p>
        {budget.overspent ? (
          <span className="badge-red flex items-center gap-1.5 text-[11px]">
            <AlertTriangle size={11} /> Overspent by {formatPKR(Math.abs(budget.remaining))}
          </span>
        ) : (
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle size={12} /> {formatPKR(budget.remaining)} left
          </span>
        )}
      </div>
    </div>
  )
}
