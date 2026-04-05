import { useState } from 'react'
import Modal from './Modal'

const ICON_OPTIONS = [
  { id: 'taxi',     label: 'Yellow Taxi', emoji: '🚕' },
  { id: 'blue-car', label: 'Blue Car',    emoji: '🚙' },
  { id: 'red-car',  label: 'Red Car',     emoji: '🚗' },
]

export default function TravelForm({ open, onClose, onSubmit, onError }) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [memberInput, setMemberInput] = useState('')
  const [members, setMembers] = useState([])
  const [password, setPassword] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [mapIcon, setMapIcon] = useState('taxi')
  const [loading, setLoading] = useState(false)

  function addMember() {
    const trimmed = memberInput.trim()
    if (trimmed && !members.includes(trimmed)) {
      setMembers([...members, trimmed])
    }
    setMemberInput('')
  }

  function removeMember(m) {
    setMembers(members.filter(x => x !== m))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name || !startDate || !endDate || !password || members.length === 0) return
    setLoading(true)
    try {
      await onSubmit({ name, date: startDate, endDate, members, password, currency, mapIcon })
      setName(''); setStartDate(''); setEndDate(''); setMembers([]); setPassword(''); setCurrency('USD'); setMapIcon('taxi')
    } catch (err) {
      onError?.(err.message || 'Failed to create trip')
    } finally {
      setLoading(false)
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="New Trip">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name} onChange={e => setName(e.target.value)} placeholder="Japan 2026" required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Members</label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={memberInput} onChange={e => setMemberInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMember())}
              placeholder="Add member name"
            />
            <button type="button" onClick={addMember}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Add</button>
          </div>
          <div className="flex flex-wrap gap-1">
            {members.map(m => (
              <span key={m} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                {m}
                <button type="button" onClick={() => removeMember(m)} className="hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="GBP">GBP (£)</option>
            <option value="TWD">TWD (NT$)</option>
            <option value="HKD">HKD (HK$)</option>
            <option value="KRW">KRW (₩)</option>
            <option value="THB">THB (฿)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Map Icon</label>
          <div className="flex gap-2">
            {ICON_OPTIONS.map(opt => (
              <button key={opt.id} type="button" onClick={() => setMapIcon(opt.id)}
                className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl border-2 text-xs transition-colors ${mapIcon === opt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-gray-500">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trip Password</label>
          <input type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password} onChange={e => setPassword(e.target.value)} required placeholder="Set a password for this trip"
            autoComplete="new-password"
          />
          <p className="text-xs text-gray-400 mt-1">This is a soft lock for sharing the trip link — not high security.</p>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
