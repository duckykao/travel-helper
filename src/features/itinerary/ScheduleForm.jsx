import { useState, useEffect } from 'react'
import Modal from '../../components/Modal'

export default function ScheduleForm({ open, onClose, onSubmit, editItem, selectedDate }) {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title || '')
      setStartTime(editItem.startTime || '')
      setEndTime(editItem.endTime || '')
      setLocation(editItem.location || '')
      setDescription(editItem.description || '')
    } else {
      setTitle(''); setStartTime(''); setEndTime(''); setLocation(''); setDescription('')
    }
  }, [editItem, open])

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ title, startTime, endTime, location, description, date: selectedDate })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editItem ? 'Edit Schedule' : 'Add Schedule'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title} onChange={e => setTitle(e.target.value)} required placeholder="Visit temple" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input type="time" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={location} onChange={e => setLocation(e.target.value)} placeholder="Optional" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Optional notes" />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
          <button type="submit"
            className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">
            {editItem ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
