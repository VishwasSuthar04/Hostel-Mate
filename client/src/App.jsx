import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ExpenseProvider } from './context/ExpenseContext'
import { BudgetProvider } from './context/BudgetContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Budget from './pages/Budget'
import Groups from './pages/Groups'
import Insights from './pages/Insights'
import Profile from './pages/Profile'

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <BudgetProvider>
          <Toaster position="top-right" toastOptions={{ className: 'font-sans text-sm' }} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="budget" element={<Budget />} />
              <Route path="groups" element={<Groups />} />
              <Route path="insights" element={<Insights />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </BudgetProvider>
      </ExpenseProvider>
    </AuthProvider>
  )
}
