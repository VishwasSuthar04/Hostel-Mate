import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Receipt, Users, Lightbulb, User, LogOut, Wallet, PiggyBank, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard',  labelUr: 'ڈیش بورڈ' },
  { to: '/expenses',  icon: Receipt,         label: 'Expenses',   labelUr: 'اخراجات' },
  { to: '/budget',    icon: PiggyBank,       label: 'Budget',     labelUr: 'بجٹ' },
  { to: '/groups',    icon: Users,           label: 'Groups',     labelUr: 'گروپ' },
  { to: '/insights',  icon: Lightbulb,       label: 'Insights',   labelUr: 'تجزیہ' },
  { to: '/profile',   icon: User,            label: 'Profile',    labelUr: 'پروفائل' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-surface-50 via-white to-brand-50/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-soft">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-5 mx-3 mt-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
              <Wallet size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white leading-none text-sm">HostelMate</p>
              <p className="text-[10px] text-brand-100 font-urdu mt-0.5">ہوسٹل میٹ</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1">
          {nav.map(({ to, icon: Icon, label, labelUr }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-50 text-brand-600 shadow-sm shadow-brand-100'
                  : 'text-surface-500 hover:text-surface-700 hover:bg-surface-100/80'
              }`
            }>
              <Icon size={18} className="transition-transform group-hover:scale-110" />
              <span className="flex-1">{label}</span>
              <span className="font-urdu text-[10px] opacity-40">{labelUr}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-surface-100 mx-3 pt-3 pb-3">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-brand-200">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 truncate leading-tight">{user?.name}</p>
              <p className="text-[11px] text-surface-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group">
            <LogOut size={15} className="transition-transform group-hover:scale-110" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-xl border-b border-surface-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
              <Wallet size={16} className="text-white" />
            </div>
            <span className="font-bold text-surface-900">HostelMate</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-100 transition-colors">
            {mobileOpen ? <X size={20} className="text-surface-600" /> : <Menu size={20} className="text-surface-600" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white/95 backdrop-blur-xl shadow-elevated animate-slide-up p-4" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-4 rounded-2xl mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Wallet size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">HostelMate</p>
                    <p className="text-[10px] text-brand-100 font-urdu">ہوسٹل میٹ</p>
                  </div>
                </div>
              </div>
              <nav className="space-y-1">
                {nav.map(({ to, icon: Icon, label }) => (
                  <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-brand-50 text-brand-600' : 'text-surface-600 hover:bg-surface-100'
                    }`
                  }>
                    <Icon size={18} /> {label}
                  </NavLink>
                ))}
              </nav>
              <div className="border-t border-surface-100 mt-4 pt-4">
                <button onClick={logout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-400 hover:text-red-600 transition-colors">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden flex items-center justify-around bg-white/95 backdrop-blur-xl border-t border-surface-100/80 py-1.5 px-2 safe-area-bottom">
          {nav.slice(0, 5).map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? 'text-brand-600' : 'text-surface-400 hover:text-surface-600'
              }`
            }>
              <Icon size={18} />
              <span className="text-[9px] font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
