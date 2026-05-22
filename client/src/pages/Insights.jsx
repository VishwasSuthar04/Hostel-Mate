import { useState, useEffect } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { formatPKR, getCategoryById } from '../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts'
import { Lightbulb, TrendingDown, AlertTriangle, CheckCircle, Sparkles, TrendingUp, BarChart3 } from 'lucide-react'
import api from '../utils/api'

export default function Insights() {
  const { stats, fetchStats } = useExpenses()
  const [aiInsights, setAiInsights] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchMonthly()
  }, [])

  const fetchMonthly = async () => {
    try {
      const { data } = await api.get('/expenses/monthly')
      setMonthlyData(data.monthly || [])
    } catch {}
  }

  const getAIInsights = async () => {
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/insights')
      setAiInsights(data)
    } catch { setAiInsights({ insights: ['Could not fetch AI insights. Make sure the AI service is running.'], recommendations: [] }) }
    finally { setAiLoading(false) }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-yellow-50 rounded-xl flex items-center justify-center">
            <Lightbulb size={18} className="text-yellow-600" />
          </div>
          <h1 className="text-xl font-bold text-surface-900">Insights</h1>
        </div>
        <p className="text-xs text-surface-400 font-urdu mt-0.5 ml-11">AI سے تجزیہ</p>
      </div>

      {/* Monthly trend */}
      <div className="card p-5 md:p-6 animate-slide-up">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <TrendingUp size={15} className="text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-surface-900">Monthly Spending Trend</h2>
            <p className="text-[10px] text-surface-400 font-urdu">ماہانہ رجحان</p>
          </div>
        </div>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₨${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [formatPKR(v), 'Spent']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Line type="monotone" dataKey="total" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#f97316' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center py-14 text-surface-400">
            <p className="text-4xl mb-3 opacity-50">📈</p>
            <p className="text-sm">Not enough data yet</p>
          </div>
        )}
      </div>

      {/* Category breakdown */}
      {stats?.byCategory?.length > 0 && (
        <div className="card p-5 md:p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <BarChart3 size={15} className="text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-surface-900">Category Breakdown</h2>
              <p className="text-[10px] text-surface-400 font-urdu">زمرہ وار تجزیہ</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byCategory.map(c => ({
              name: getCategoryById(c._id)?.labelEn || c._id,
              total: c.total,
              fill: getCategoryById(c._id)?.color || '#f97316'
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₨${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [formatPKR(v), 'Amount']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={40}>
                {stats.byCategory.map((entry, i) => (
                  <Cell key={i} fill={getCategoryById(entry._id)?.color || '#f97316'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI Insights */}
      <div className="card p-5 md:p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-sm shadow-yellow-200/50">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-surface-900">AI-Powered Insights</h2>
              <p className="text-[10px] text-surface-400 font-urdu">AI سے سمارٹ مشورے</p>
            </div>
          </div>
          <button onClick={getAIInsights} disabled={aiLoading}
            className="btn-primary text-sm flex items-center gap-2 !py-2 !px-4 shadow-lg shadow-brand-200/50">
            {aiLoading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing…</>
              : <><Sparkles size={14} /> Analyze</>}
          </button>
        </div>

        {!aiInsights ? (
          <div className="flex flex-col items-center py-10 text-surface-400">
            <p className="text-4xl mb-3">🤖</p>
            <p className="text-sm">Click Analyze to get personalized spending insights</p>
          </div>
        ) : (
          <div className="space-y-3">
            {aiInsights.insights?.map((insight, i) => (
              <div key={i} className="flex gap-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-50/30 rounded-xl border border-yellow-100/80 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-surface-700 leading-relaxed">{insight}</p>
              </div>
            ))}
            {aiInsights.recommendations?.map((rec, i) => (
              <div key={i} className="flex gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/30 rounded-xl border border-emerald-100/80 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <CheckCircle size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-surface-700 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
