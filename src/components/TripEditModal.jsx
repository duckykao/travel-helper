import { useState, useEffect } from 'react'
import Modal from './Modal'

const ICON_OPTIONS = [
  { id: 'taxi',     label: 'Yellow Taxi', emoji: '🚕' },
  { id: 'blue-car', label: 'Blue Car',    emoji: '🚙' },
  { id: 'red-car',  label: 'Red Car',     emoji: '🚗' },
]

function parseMapsUrl(str) {
  try {
    const url = new URL(str)
    if (!url.hostname.includes('google.com') && !url.hostname.includes('goo.gl')) return null
    const placeMatch = url.pathname.match(/\/maps\/place\/([^/@]+)/)
    if (placeMatch) return { name: decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')), url: str }
    const q = url.searchParams.get('q')
    if (q) return { name: q, url: str }
    return { name: null, url: str }
  } catch { return null }
}

export default function TripEditModal({ open, onClose, travel, onSave }) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [members, setMembers] = useState([])
  const [memberInput, setMemberInput] = useState('')
  const [homeLocation, setHomeLocation] = useState('')
  const [mapIcon, setMapIcon] = useState('taxi')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open && travel) {
      setName(travel.name || '')
      setStartDate(travel.date || '')
      setEndDate(travel.endDate || '')
      setMembers([...(travel.members || [])])
      setMemberInput('')
      setHomeLocation(travel.homeLocation || '')
      setMapIcon(travel.mapIcon || 'taxi')
    }
  }, [open])

  function addMember() {
    const trimmed = memberInput.trim()
    if (trimmed && !members.includes(trimmed)) setMembers(prev => [...prev, trimmed])
    setMemberInput('')
  }

  function removeMember(m) {
    setMembers(prev => prev.filter(x => x !== m))
  }

  async function handleSave() {
    if (!name.trim() || !startDate || !endDate || members.length === 0) return
    try {
      await onSave({ name: name.trim(), date: startDate, endDate, members, homeLocation: homeLocation.trim(), mapIcon })
    } finally {
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Trip">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name} onChange={e => setName(e.target.value)} placeholder="Japan 2026"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate} onChange={e => setEndDate(e.target.value)} />
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Starting Location <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={homeLocation} onChange={e => setHomeLocation(e.target.value)}
            placeholder="Paste a Google Maps URL"
          />
          {(() => {
            const maps = parseMapsUrl(homeLocation)
            if (!maps) return null
            return (
              <a href={maps.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600 hover:underline">
                📍 {maps.name || 'View on Google Maps'} ↗
              </a>
            )
          })()}
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

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
          <button type="button" onClick={handleSave}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">Save</button>
        </div>
      </div>
    </Modal>
  )
}
