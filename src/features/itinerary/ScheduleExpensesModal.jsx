import Modal from '../../components/Modal'
import ExpenseItem from '../expenses/ExpenseItem'
import { formatCurrency } from '../../utils/formatters'

export default function ScheduleExpensesModal({ open, onClose, item, expenses, categories, currency, onAdd, onEdit, onDelete }) {
  if (!item) return null

  const linked = expenses.filter(e => e.scheduleId === item.id)
  const total = linked.reduce((sum, e) => sum + e.amount, 0)

  return (
    <Modal open={open} onClose={onClose} title={`💰 ${item.title}`}>
      <div className="flex flex-col gap-3">
        {linked.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-500 pb-1 border-b border-gray-100">
            <span>{linked.length} expense{linked.length !== 1 ? 's' : ''}</span>
            <span className="font-medium text-gray-700">{formatCurrency(total, currency)}</span>
          </div>
        )}

        {linked.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-2xl mb-2">💸</div>
            <p className="text-sm">No expenses linked to this schedule yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {linked.map(e => (
              <ExpenseItem
                key={e.id}
                expense={e}
                currency={currency}
                categories={categories}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">
            Close
          </button>
          <button onClick={onAdd}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">
            + Add Expense
          </button>
        </div>
      </div>
    </Modal>
  )
}
