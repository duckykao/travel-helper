import { useState, useEffect } from 'react'
import Modal from '../../components/Modal'
import { formatCurrency } from '../../utils/formatters'

export default function ExpenseForm({ open, onClose, onSubmit, editExpense, members, categories, currency, itineraryItems = [] }) {
  const [amount, setAmount] = useState('')
  const [payer, setPayer] = useState(members[0] || '')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [splitType, setSplitType] = useState('equal')
  const [involvedMembers, setInvolvedMembers] = useState([...members])
  const [splitAmounts, setSplitAmounts] = useState({})
  const [scheduleId, setScheduleId] = useState('')

  useEffect(() => {
    if (editExpense) {
      setAmount(String(editExpense.amount))
      setPayer(editExpense.payer)
      setDescription(editExpense.description || '')
      const matchedCat = categories.find(c => c.id === editExpense.categoryId)
        || categories.find(c => c.label === editExpense.category)
      setCategoryId(matchedCat?.id || categories[0]?.id || '')
      setDate(editExpense.date)
      setSplitType(editExpense.splitType)
      setInvolvedMembers(editExpense.involvedMembers || [...members])
      setSplitAmounts(editExpense.splitAmounts || {})
      setScheduleId(editExpense.scheduleId || '')
    } else {
      setAmount('')
      setPayer(members[0] || '')
      setDescription('')
      setCategoryId(categories[0]?.id || '')
      setDate(new Date().toISOString().slice(0, 10))
      setSplitType('equal')
      setInvolvedMembers([...members])
      setSplitAmounts({})
      setScheduleId('')
    }
  }, [editExpense, open, members, categories])

  function toggleMember(m) {
    setInvolvedMembers(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    )
  }

  const equalShare = involvedMembers.length > 0 && amount
    ? (parseFloat(amount) / involvedMembers.length).toFixed(2)
    : '0.00'

  function handleSubmit(e) {
    e.preventDefault()
    const selectedCat = categories.find(c => c.id === categoryId)
    const selectedSchedule = itineraryItems.find(i => i.id === scheduleId)
    onSubmit({
      amount: parseFloat(amount),
      payer,
      description,
      category: selectedCat?.label || '',
      categoryId: categoryId || '',
      date,
      splitType,
      involvedMembers,
      splitAmounts,
      scheduleId: scheduleId || null,
      scheduleName: selectedSchedule?.title || null,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editExpense ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input type="number" step="0.01" min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description} onChange={e => setDescription(e.target.value)} placeholder="Ramen lunch" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid by</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={payer} onChange={e => setPayer(e.target.value)}>
              {members.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon ? `${c.icon} ` : ''}{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {itineraryItems.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Linked Schedule</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={scheduleId} onChange={e => setScheduleId(e.target.value)}>
              <option value="">None</option>
              {itineraryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.date}{item.startTime ? ` ${item.startTime}` : ''} — {item.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Split</label>
          <div className="flex gap-2 mb-3">
            {['equal', 'custom', 'payer-only'].map(type => (
              <button key={type} type="button" onClick={() => setSplitType(type)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  splitType === type
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}>
                {type === 'equal' ? 'Equal' : type === 'custom' ? 'Custom' : 'Payer Only'}
              </button>
            ))}
          </div>

          {splitType !== 'payer-only' && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Who's included:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {members.map(m => (
                  <button key={m} type="button" onClick={() => toggleMember(m)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      involvedMembers.includes(m)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-500 border-gray-200'
                    }`}>
                    {m}
                  </button>
                ))}
              </div>

              {splitType === 'equal' && amount && (
                <p className="text-xs text-gray-500">Each person pays: {formatCurrency(parseFloat(equalShare), currency)}</p>
              )}

              {splitType === 'custom' && (
                <div className="flex flex-col gap-2 mt-2">
                  {involvedMembers.map(m => (
                    <div key={m} className="flex items-center gap-2">
                      <span className="text-sm w-20 text-gray-700">{m}</span>
                      <input type="number" step="0.01" min="0"
                        className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={splitAmounts[m] || ''}
                        onChange={e => setSplitAmounts(prev => ({ ...prev, [m]: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
          <button type="submit"
            className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">
            {editExpense ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
