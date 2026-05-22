import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Wallet } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-surface-50 via-white to-brand-50/30 gap-4">
      <div className="w-14 h-14 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200/50 animate-pulse-slow">
        <Wallet size={28} className="text-white" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 border-[3px] border-brand-200 border-t-brand-500 rounded-full animate-spin" />
        <span className="text-sm text-surface-400 font-medium">Loading your dashboard…</span>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}
