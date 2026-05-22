import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useExpenses } from '../context/ExpenseContext'
import { formatPKR, formatDate, getCategoryById } from '../utils/helpers'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Plus, ArrowRight, Sparkles, Pizza, Building2, Zap, Bus, ShoppingCart, Wifi, Pill, UtensilsCrossed, ShoppingBag, Clapperboard, BookOpen, Dumbbell, Smartphone, Shield, PiggyBank, Package, CalendarDays, History, CreditCard, Receipt } from 'lucide-react'
import BudgetCard from '../components/BudgetCard'

export default function Dashboard() {
  const { user } = useAuth()
  const { expenses, stats, fetchExpenses, fetchStats, loading } = useExpenses()

  useEffect(() => { fetchExpenses({ limit: 5 }); fetchStats() }, [])

  const CATEGORY_ICONS = {
    food: Pizza, rent: Building2, utilities: Zap, transport: Bus,
    groceries: ShoppingCart, internet: Wifi, medical: Pill, dining: UtensilsCrossed,
    shopping: ShoppingBag, entertain: Clapperboard, education: BookOpen,
    fitness: Dumbbell, subscription: Smartphone, insurance: Shield,
    savings: PiggyBank, other: Package,
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const greetingUr = hour < 12 ? 'صبح بخیر' : hour < 17 ? 'دوپہر بخیر' : 'شام بخیر'

  const pieData = stats?.byCategory?.map(c => ({
    name: getCategoryById(c._id)?.labelEn || c._id,
    value: c.total,
    color: getCategoryById(c._id)?.color || '#6b7280'
  })) || []

  const statCards = [
    { label: 'This Month', labelUr: 'اس ماہ', value: formatPKR(stats?.thisMonth || 0), icon: CalendarDays, color: 'text-red-500', bg: 'bg-red-50', gradient: 'from-red-500 to-red-400' },
    { label: 'Last Month', labelUr: 'گزشتہ ماہ', value: formatPKR(stats?.lastMonth || 0), icon: History, color: 'text-green-500', bg: 'bg-green-50', gradient: 'from-emerald-500 to-green-400' },
    { label: 'Total Spent', labelUr: 'کل اخراجات', value: formatPKR(stats?.total || 0), icon: CreditCard, color: 'text-brand-500', bg: 'bg-brand-50', gradient: 'from-brand-500 to-orange-400' },
    { label: 'Groups', labelUr: 'گروپ', value: stats?.groupCount || 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50', gradient: 'from-purple-500 to-violet-400' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-surface-400 text-sm">{greeting},</p>
            <span className="font-urdu text-xs text-surface-300">{greetingUr}</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900 mt-0.5">{user?.name?.split(' ')[0]} <span className="text-2xl">👋</span></h1>
        </div>
        <Link to="/expenses" className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-brand-200/50">
          <Plus size={16} /> Add Expense
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {statCards.map(s => (
          <div key={s.label} className={`${s.bg} card-hover p-4 md:p-5 animate-slide-up bg-opacity-40`}>
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="text-xl md:text-2xl font-bold text-surface-900">{s.value}</p>
            <p className="text-xs text-surface-400 mt-0.5 font-medium">{s.label}</p>
            <p className="text-[10px] text-surface-300 font-urdu">{s.labelUr}</p>
          </div>
        ))}
      </div>

      {/* Budget Card */}
      <BudgetCard />

      {/* Chart + Recent */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Pie */}
        <div className="card p-5 md:p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
              <Sparkles size={15} className="text-brand-600" />
            </div>
            <h2 className="font-semibold text-surface-900">Spending by Category</h2>
          </div>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" paddingAngle={3}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color}>
                        <animate attributeName="opacity" from="0" to="1" dur="0.5s" />
                      </Cell>
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatPKR(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-4">
                {pieData.slice(0, 8).map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs text-surface-500">
                    <span className="w-3 h-3 rounded-md flex-shrink-0" style={{ background: d.color }} />
                    {d.name}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-12 text-surface-400">
              <p className="text-4xl mb-3 opacity-60">📊</p>
              <p className="text-sm">No data yet</p>
            </div>
          )}
        </div>

        {/* Recent */}
        <div className="card p-5 md:p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-surface-100 rounded-lg flex items-center justify-center">
                <Receipt size={15} className="text-surface-500" />
              </div>
              <h2 className="font-semibold text-surface-900">Recent Expenses</h2>
            </div>
            <Link to="/expenses" className="text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 skeleton" />)}</div>
          ) : expenses.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-surface-400">
              <p className="text-4xl mb-3 opacity-60">💸</p>
              <p className="text-sm">No expenses yet</p>
              <Link to="/expenses" className="text-brand-600 font-medium text-sm mt-1 hover:underline">Add one!</Link>
            </div>
          ) : (
            <div className="space-y-1">
                {expenses.slice(0, 5).map((exp, i) => {
                  const cat = getCategoryById(exp.category)
                  const Icon = CATEGORY_ICONS[cat?.id] || Package
                  return (
                    <div key={exp._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-all duration-150 group"
                      style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat?.color + '18' }}>
                        <Icon size={18} />
                      </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{exp.description}</p>
                      <p className="text-xs text-surface-400">{formatDate(exp.date)}</p>
                    </div>
                    <span className="text-sm font-bold text-red-600 flex-shrink-0">{formatPKR(exp.amount)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
