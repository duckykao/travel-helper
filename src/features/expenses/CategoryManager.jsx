import { useState } from 'react'
import Modal from '../../components/Modal'

const PRESET_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#7BC8A4']

export default function CategoryManager({ open, onClose, categories, onAdd, onDelete, onUpdate }) {
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('#FF6384')
  const [icon, setIcon] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editLabel, setEditLabel] = useState('')
  const [editColor, setEditColor] = useState('')
  const [editIcon, setEditIcon] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    if (!label.trim()) return
    await onAdd({ label: label.trim(), color, icon: icon.trim() })
    setLabel('')
    setIcon('')
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditLabel(cat.label)
    setEditColor(cat.color)
    setEditIcon(cat.icon || '')
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!editLabel.trim()) return
    await onUpdate(editingId, { label: editLabel.trim(), color: editColor, icon: editIcon.trim() })
    setEditingId(null)
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage Categories">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {categories.map(cat => (
            <div key={cat.id}>
              {editingId === cat.id ? (
                <form onSubmit={handleUpdate} className="flex flex-col gap-2 py-1">
                  <div className="flex gap-2">
                    <input
                      className="w-12 border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editIcon} onChange={e => setEditIcon(e.target.value)}
                      placeholder="🌟" maxLength={4} title="Emoji icon" />
                    <input
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editLabel} onChange={e => setEditLabel(e.target.value)} />
                    <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Save</button>
                    <button type="button" onClick={cancelEdit} className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    {PRESET_COLORS.map(c => (
                      <button key={c} type="button" onClick={() => setEditColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${editColor === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                        style={{ background: c }} />
                    ))}
                    <label className="relative w-6 h-6 rounded-full overflow-hidden border-2 cursor-pointer transition-all"
                      style={{ borderColor: !PRESET_COLORS.includes(editColor) ? '#1f2937' : 'transparent', background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}
                      title="Custom color">
                      <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                    </label>
                    {!PRESET_COLORS.includes(editColor) && (
                      <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" style={{ background: editColor }} />
                    )}
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0 inline-block" style={{ background: cat.color }} />
                    {cat.icon && <span className="text-base leading-none">{cat.icon}</span>}
                    <span className="text-sm text-gray-700">{cat.label}</span>
                  </div>
                  {!cat._virtual && (
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(cat)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button onClick={() => onDelete(cat.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="flex flex-col gap-3 border-t pt-3">
          <p className="text-sm font-medium text-gray-700">Add Category</p>
          <div className="flex gap-2">
            <input
              className="w-12 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={icon} onChange={e => setIcon(e.target.value)}
              placeholder="🌟" maxLength={4} title="Emoji icon" />
            <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={label} onChange={e => setLabel(e.target.value)} placeholder="Category name" />
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Add</button>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {PRESET_COLORS.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                style={{ background: c }} />
            ))}
            <label className="relative w-6 h-6 rounded-full overflow-hidden border-2 cursor-pointer transition-all"
              style={{ borderColor: !PRESET_COLORS.includes(color) ? '#1f2937' : 'transparent', background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}
              title="Custom color">
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
            </label>
            {!PRESET_COLORS.includes(color) && (
              <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" style={{ background: color }} />
            )}
          </div>
        </form>

        <button onClick={onClose} className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Done</button>
      </div>
    </Modal>
  )
}
