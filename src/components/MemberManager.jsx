import { useState, useEffect } from 'react'
import Modal from './Modal'

export default function MemberManager({ open, onClose, members, onSave }) {
  const [list, setList] = useState([])
  const [input, setInput] = useState('')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) {
      setList([...members])
      setInput('')
    }
  }, [open])

  function addMember() {
    const trimmed = input.trim()
    if (trimmed && !list.includes(trimmed)) setList(prev => [...prev, trimmed])
    setInput('')
  }

  function removeMember(m) {
    setList(prev => prev.filter(x => x !== m))
  }

  function handleSave() {
    onSave(list)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage Members">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMember())}
            placeholder="Add member name"
          />
          <button type="button" onClick={addMember}
            className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Add</button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[2rem]">
          {list.map(m => (
            <span key={m} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
              {m}
              <button type="button" onClick={() => removeMember(m)}
                className="hover:text-red-500 font-bold leading-none ml-1">×</button>
            </span>
          ))}
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
