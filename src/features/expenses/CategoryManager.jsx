import { useState } from 'react'
import Modal from '../../components/Modal'

const PRESET_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#7BC8A4']

export default function CategoryManager({ open, onClose, categories, onAdd, onDelete }) {
  const [label, setLabel] = useState('')
  const [color, setColor] = useState('#FF6384')

  async function handleAdd(e) {
    e.preventDefault()
    if (!label.trim()) return
    await onAdd({ label: label.trim(), color })
    setLabel('')
  }

  return (
    <Modal open={open} onClose={onClose} title="Manage Categories">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: cat.color }} />
                <span className="text-sm text-gray-700">{cat.label}</span>
              </div>
              <button onClick={() => onDelete(cat.id)} className="text-gray-400 hover:text-red-500 text-xs">🗑️</button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="flex flex-col gap-3 border-t pt-3">
          <p className="text-sm font-medium text-gray-700">Add Category</p>
          <div className="flex gap-2">
            <input className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={label} onChange={e => setLabel(e.target.value)} placeholder="Category name" />
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Add</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                style={{ background: c }} />
            ))}
          </div>
        </form>

        <button onClick={onClose} className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Done</button>
      </div>
    </Modal>
  )
}
