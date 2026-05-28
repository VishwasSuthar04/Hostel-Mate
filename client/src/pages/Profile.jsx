import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { User, Mail, MapPin, Save, Camera, Shield, Upload } from 'lucide-react'

export default function Profile() {
  const { user, fetchMe } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', city: user?.city || '' })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put('/auth/profile', form)
      await fetchMe()
      toast.success('Profile updated ✓')
    } catch { toast.error('Update failed') }
    finally { setLoading(false) }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) return toast.error('Only PNG and JPG images allowed')
    if (file.size > 5 * 1024 * 1024) return toast.error('File too large (max 5MB)')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('avatar', file)
      const { data } = await api.post('/auth/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      await fetchMe()
      toast.success('Avatar updated!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <User size={18} className="text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-surface-900">Profile</h1>
        </div>
        <p className="text-xs text-surface-400 font-urdu mt-0.5 ml-11">پروفائل</p>
      </div>

      <div className="card p-6 md:p-7 animate-slide-up">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-7 pb-6 border-b border-surface-100">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-brand-200/50 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-xl border border-surface-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all hover:scale-105 disabled:opacity-50">
              {uploading ? <Upload size={13} className="text-brand-500 animate-pulse" /> : <Camera size={13} className="text-surface-500" />}
            </button>
            <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleAvatarUpload} />
          </div>
          <div>
            <h2 className="font-bold text-surface-900 text-lg">{user?.name}</h2>
            <p className="text-surface-400 text-sm">{user?.email}</p>
            <span className="badge-green text-[11px] mt-1.5 inline-flex">Active</span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-2">
              <User size={14} className="text-surface-400" /> Full Name
            </label>
            <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-2">
              <Mail size={14} className="text-surface-400" /> Email
            </label>
            <input value={user?.email} disabled className="input bg-surface-50 text-surface-400 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-2">
              <MapPin size={14} className="text-surface-400" /> City
            </label>
            <select value={form.city} onChange={e => setForm(p => ({...p, city: e.target.value}))} className="input">
              <option value="">Select city</option>
              {['Karachi','Lahore','Islamabad','Rawalpindi','Faisalabad','Multan','Peshawar','Quetta'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSave} disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-6">
            <Save size={15} /> {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="card p-5 animate-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={15} className="text-surface-400" />
          <h3 className="text-sm font-semibold text-surface-700">Account</h3>
        </div>
        <div className="space-y-2 text-sm text-surface-400">
          <div className="flex justify-between">
            <span>Member since</span>
            <span className="text-surface-600 font-medium">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Currency</span>
            <span className="text-surface-600 font-medium">PKR 🇵🇰</span>
          </div>
        </div>
      </div>
    </div>
  )
}
