import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Wallet, User, Mail, Lock, MapPin } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const fieldIcon = (icon, key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400">{icon}</span>
        <input type={type} value={form[key]} onChange={e => setForm(p => ({...p, [key]: e.target.value}))}
          className="input pl-10" placeholder={placeholder} required />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-brand-200/30 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-200/50 animate-scale-in">
            <Wallet size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900">اکاؤنٹ بنائیں</h1>
          <p className="text-surface-400 mt-1.5 text-sm">Create your HostelMate account</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-7 shadow-elevated border border-white/50 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fieldIcon(<User size={15} />, 'name', 'Full Name', 'text', 'Ali Hassan')}
            {fieldIcon(<Mail size={15} />, 'email', 'Email', 'email', 'ali@example.com')}
            {fieldIcon(<Lock size={15} />, 'password', 'Password', 'password', '••••••••')}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">City</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 z-10" />
                <select value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} className="input pl-10 appearance-none">
                  <option value="">Select city</option>
                  {['Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating…</> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-surface-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
