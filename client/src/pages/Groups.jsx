import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { formatPKR } from '../utils/helpers'
import toast from 'react-hot-toast'
import { Users, Plus, UserPlus, X, Wallet, LogOut, User, Mail, Copy, Check } from 'lucide-react'

export default function Groups() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [showInvite, setShowInvite] = useState(null)
  const [showJoin, setShowJoin] = useState(false)
  const [joinId, setJoinId] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', description: '' })

  const fetchGroups = useCallback(async () => {
    try { const { data } = await api.get('/groups'); setGroups(data.groups) }
    catch { toast.error('Failed to load groups') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchGroups() }, [fetchGroups])

  const createGroup = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/groups', newGroup)
      setGroups(p => [data.group, ...p])
      setShowCreate(false)
      setNewGroup({ name: '', description: '' })
      toast.success('Group created!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const handleInvite = async (g) => {
    if (!inviteEmail) return toast.error('Enter an email address')
    setInviting(true)
    try {
      const { data } = await api.post(`/groups/${g._id}/invite`, { email: inviteEmail })
      setGroups(p => p.map(gr => gr._id === g._id ? data.group : gr))
      if (showDetail?._id === g._id) setShowDetail(data.group)
      setInviteEmail('')
      toast.success(data.message)
    } catch (err) { toast.error(err.response?.data?.message || 'Invite failed') }
    finally { setInviting(false) }
  }

  const handleLeave = async (g) => {
    try {
      await api.post(`/groups/${g._id}/leave`)
      setGroups(p => p.filter(gr => gr._id !== g._id))
      setShowDetail(null)
      toast.success('Left the group')
    } catch { toast.error('Failed to leave group') }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/groups/join', { groupId: joinId })
      setGroups(p => [data.group, ...p])
      setShowJoin(false)
      setJoinId('')
      toast.success('Joined group!')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to join') }
  }

  const copyGroupId = (id) => {
    navigator.clipboard.writeText(id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Group ID copied!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users size={18} className="text-purple-600" />
            </div>
            <h1 className="text-xl font-bold text-surface-900">Groups</h1>
          </div>
          <p className="text-xs text-surface-400 font-urdu mt-0.5 ml-11">گروپ اخراجات</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowJoin(true)} className="btn-secondary text-sm flex items-center gap-1.5">
            <UserPlus size={14} /> Join
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm shadow-lg shadow-brand-200/50">
            <Plus size={16} /> New Group
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-44 skeleton" />)}
        </div>
      ) : groups.length === 0 ? (
        <div className="card p-16 text-center flex flex-col items-center animate-slide-up">
          <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
            <Users size={32} className="text-surface-300" />
          </div>
          <p className="text-surface-500 font-medium mb-1">No groups yet</p>
          <p className="text-sm text-surface-400">Create one or join an existing group with an ID</p>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setShowCreate(true)} className="btn-primary text-sm">Create Group</button>
            <button onClick={() => setShowJoin(true)} className="btn-secondary text-sm">Join Group</button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {groups.map((g, i) => (
            <div key={g._id} className="card-hover p-5 animate-slide-up cursor-pointer"
              style={{ animationDelay: `${i * 50}ms` }} onClick={() => setShowDetail(g)}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-sm shadow-purple-200/50">
                  <Users size={20} className="text-white" />
                </div>
                <span className="badge-purple text-[11px]">{g.members?.length || 1} member{(g.members?.length || 1) > 1 ? 's' : ''}</span>
              </div>
              <h3 className="font-bold text-surface-900">{g.name}</h3>
              {g.description && <p className="text-sm text-surface-400 mt-1.5 leading-relaxed">{g.description}</p>}
              <div className="mt-5 pt-4 border-t border-surface-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-surface-500">
                  <Wallet size={14} />
                  <span className="font-medium">{formatPKR(g.totalExpenses || 0)} total</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setShowInvite(g); setInviteEmail('') }}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-brand-50">
                  <UserPlus size={13} /> Invite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="font-bold text-surface-900">Create Group</h2>
                <p className="text-xs text-surface-400">Split expenses with roommates</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-xl hover:bg-surface-100 flex items-center justify-center">
                <X size={18} className="text-surface-400" />
              </button>
            </div>
            <form onSubmit={createGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Group Name</label>
                <input value={newGroup.name} onChange={e => setNewGroup(p => ({...p, name: e.target.value}))}
                  className="input" placeholder="e.g. Hostel Room 4B" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Description <span className="text-surface-300">(optional)</span></label>
                <input value={newGroup.description} onChange={e => setNewGroup(p => ({...p, description: e.target.value}))}
                  className="input" placeholder="e.g. Shared expenses for room 4B" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoin && (
        <div className="modal-overlay" onClick={() => setShowJoin(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="font-bold text-surface-900">Join Group</h2>
                <p className="text-xs text-surface-400">Enter the group ID to join</p>
              </div>
              <button onClick={() => setShowJoin(false)} className="w-8 h-8 rounded-xl hover:bg-surface-100 flex items-center justify-center">
                <X size={18} className="text-surface-400" />
              </button>
            </div>
            <form onSubmit={handleJoin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Group ID</label>
                <input value={joinId} onChange={e => setJoinId(e.target.value)}
                  className="input font-mono text-sm" placeholder="Paste the group ID here" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowJoin(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Join Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Detail Modal */}
      {showDetail && (
        <div className="modal-overlay" onClick={() => setShowDetail(null)}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-lg shadow-modal animate-scale-in"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-4 border-b border-surface-100">
              <div>
                <h2 className="font-bold text-surface-900 text-lg">{showDetail.name}</h2>
                {showDetail.description && <p className="text-xs text-surface-400 mt-0.5">{showDetail.description}</p>}
              </div>
              <button onClick={() => setShowDetail(null)} className="w-8 h-8 rounded-xl hover:bg-surface-100 flex items-center justify-center">
                <X size={18} className="text-surface-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-surface-700 flex items-center gap-2">
                    <Users size={15} /> Members ({showDetail.members?.length || 1})
                  </h3>
                  <button onClick={() => { setShowInvite(showDetail); setInviteEmail('') }}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    <UserPlus size={12} /> Invite
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                  {showDetail.members?.map((m, i) => (
                    <div key={m._id || i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-surface-300 to-surface-400 flex items-center justify-center text-white font-bold text-xs">
                        {m.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-900 truncate">
                          {m.name}
                          {m._id === showDetail.createdBy?._id && <span className="text-[10px] text-brand-600 ml-1.5 font-normal">(Admin)</span>}
                        </p>
                        <p className="text-xs text-surface-400 truncate">{m.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-surface-100 flex items-center justify-between">
                <button onClick={() => copyGroupId(showDetail._id)}
                  className="text-xs text-surface-400 hover:text-surface-600 flex items-center gap-1.5 transition-colors">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy Group ID'}
                </button>
                <button onClick={() => handleLeave(showDetail)}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                  <LogOut size={13} /> Leave Group
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-surface-500 pt-1">
                <Wallet size={14} />
                <span className="font-medium">{formatPKR(showDetail.totalExpenses || 0)} total expenses</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="font-bold text-surface-900">Invite to {showInvite.name}</h2>
                <p className="text-xs text-surface-400">Add a member by their email</p>
              </div>
              <button onClick={() => setShowInvite(null)} className="w-8 h-8 rounded-xl hover:bg-surface-100 flex items-center justify-center">
                <X size={18} className="text-surface-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    className="input pl-10" placeholder="roommate@example.com" />
                </div>
              </div>
              <p className="text-xs text-surface-400">The user must have a HostelMate account with this email.</p>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowInvite(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => handleInvite(showInvite)} disabled={inviting}
                  className="btn-primary flex-1 flex items-center justify-center gap-1.5">
                  {inviting ? 'Adding…' : <><UserPlus size={14} /> Add Member</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
