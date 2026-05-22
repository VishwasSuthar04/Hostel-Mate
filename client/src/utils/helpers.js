export const formatPKR = (amount) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount)

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))

export const CATEGORIES = [
  { id: 'food',        label: 'کھانا',      labelEn: 'Food',          color: '#f97316', icon: '🍕' },
  { id: 'rent',        label: 'کرایہ',      labelEn: 'Rent',          color: '#8b5cf6', icon: '🏠' },
  { id: 'utilities',  label: 'بجلی/گیس',   labelEn: 'Utilities',     color: '#06b6d4', icon: '⚡' },
  { id: 'transport',  label: 'سفر',         labelEn: 'Transport',     color: '#10b981', icon: '🚌' },
  { id: 'groceries',  label: 'سودا سلف',   labelEn: 'Groceries',     color: '#84cc16', icon: '🛒' },
  { id: 'internet',   label: 'انٹرنیٹ',    labelEn: 'Internet',      color: '#3b82f6', icon: '📶' },
  { id: 'medical',    label: 'طبی',         labelEn: 'Medical',       color: '#ef4444', icon: '💊' },
  { id: 'dining',     label: 'ریسٹورنٹ',   labelEn: 'Dining Out',    color: '#ec4899', icon: '🍽️' },
  { id: 'shopping',   label: 'خریداری',    labelEn: 'Shopping',      color: '#a855f7', icon: '🛍️' },
  { id: 'entertain',  label: 'تفریح',       labelEn: 'Entertainment', color: '#14b8a6', icon: '🎬' },
  { id: 'education',  label: 'تعلیم',       labelEn: 'Education',     color: '#6366f1', icon: '📚' },
  { id: 'fitness',    label: 'صحت',         labelEn: 'Fitness',       color: '#22c55e', icon: '💪' },
  { id: 'subscription', label: 'سبسکرپشن', labelEn: 'Subscriptions', color: '#eab308', icon: '📱' },
  { id: 'insurance',  label: 'انشورنس',    labelEn: 'Insurance',     color: '#78716c', icon: '🛡️' },
  { id: 'savings',    label: 'بچت',         labelEn: 'Savings',       color: '#2dd4bf', icon: '🐷' },
  { id: 'other',      label: 'دیگر',        labelEn: 'Other',         color: '#6b7280', icon: '📦' },
]

export const getCategoryById = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES.find(c => c.id === 'other')
