import { useState, useEffect } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { formatPKR, formatDate, getCategoryById, CATEGORIES } from '../utils/helpers'
import toast from 'react-hot-toast'
import { Plus, Trash2, Search, X, Receipt, Pizza, Building2, Zap, Bus, ShoppingCart, Wifi, Pill, UtensilsCrossed, ShoppingBag, Clapperboard, BookOpen, Dumbbell, Smartphone, Shield, PiggyBank, Package } from 'lucide-react'

function AddExpenseModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await onAdd({ ...form, amount: Number(form.amount) }); onClose() }
    catch { toast.error('Failed to add expense') }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="font-bold text-surface-900">Add Expense</h2>
            <p className="text-xs text-surface-400 font-urdu">خرچہ شامل کریں</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-surface-100 flex items-center justify-center transition-colors">
            <X size={18} className="text-surface-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
            <input value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
              className="input" placeholder="e.g. Dinner at Kolachi" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Amount (PKR)</label>
              <input type="number" value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))}
                className="input" placeholder="500" required min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
                className="input" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map(cat => {
                  const Icon = CATEGORY_ICONS[cat.id] || Package
                  return (
                    <button type="button" key={cat.id} onClick={() => setForm(p => ({...p, category: cat.id}))}
                      className={`p-2 rounded-xl text-center text-xs transition-all border ${
                        form.category === cat.id
                          ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-sm shadow-brand-100'
                          : 'border-surface-200 hover:border-surface-300 text-surface-500 hover:text-surface-700'
                      }`}>
                      <div className="mb-0.5 flex justify-center"><Icon size={18} /></div>
                      {cat.labelEn}
                    </button>
                  )
                })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Notes <span className="text-surface-300">(optional)</span></label>
            <input value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))}
              className="input" placeholder="Any additional notes…" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Adding…' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CATEGORY_ICONS = {
  food: Pizza, rent: Building2, utilities: Zap, transport: Bus,
  groceries: ShoppingCart, internet: Wifi, medical: Pill, dining: UtensilsCrossed,
  shopping: ShoppingBag, entertain: Clapperboard, education: BookOpen,
  fitness: Dumbbell, subscription: Smartphone, insurance: Shield,
  savings: PiggyBank, other: Package,
}

export default function Expenses() {
  const { expenses, loading, fetchExpenses, addExpense, deleteExpense } = useExpenses()
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchExpenses() }, [])

  const filtered = expenses.filter(e => {
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || e.category === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
              <Receipt size={18} className="text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-surface-900">Expenses</h1>
          </div>
          <p className="text-xs text-surface-400 font-urdu mt-0.5 ml-11">اخراجات</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-brand-200/50">
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="card p-3 md:p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9 py-2 text-sm" placeholder="Search expenses…" />
        </div>
        <div className="flex gap-1.5 flex-wrap max-h-20 overflow-y-auto scrollbar-thin">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'all' ? 'bg-surface-800 text-white shadow-sm' : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
            }`}>All</button>
          {CATEGORIES.map(cat => {
            const Icon = CATEGORY_ICONS[cat.id] || Package
            return (
              <button key={cat.id} onClick={() => setFilter(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  filter === cat.id ? 'bg-surface-800 text-white shadow-sm' : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                }`}>
                <Icon size={14} className="inline" /> {cat.labelEn}
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 skeleton" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-surface-400">
            <p className="text-5xl mb-4 opacity-50">💸</p>
            <p className="text-sm font-medium">No expenses found</p>
            {search || filter !== 'all' ? (
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            ) : (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4 text-sm">Add your first expense</button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {filtered.map((exp, i) => {
              const cat = getCategoryById(exp.category)
              const Icon = CATEGORY_ICONS[cat?.id] || Package
              return (
                <div key={exp._id} className="flex items-center gap-4 px-4 md:px-5 py-3.5 hover:bg-surface-50 group transition-all duration-150"
                  style={{ animation: `fadeIn 0.2s ease-out ${i * 30}ms both` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat?.color + '18' }}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-surface-900 text-sm truncate">{exp.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-surface-400">{formatDate(exp.date)}</span>
                      <span className="w-1 h-1 rounded-full bg-surface-300" />
                      {cat && <span className="badge-orange text-[10px] py-0">{cat.labelEn}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-bold text-red-600 text-sm">{formatPKR(exp.amount)}</span>
                    <button onClick={() => deleteExpense(exp._id)}
                      className="opacity-0 group-hover:opacity-100 text-surface-300 hover:text-red-500 transition-all p-1.5 rounded-lg hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showModal && <AddExpenseModal onClose={() => setShowModal(false)} onAdd={addExpense} />}
    </div>
  )
}
