import { formatCurrency } from '../../utils/formatters'

export default function ExpenseItem({ expense, currency, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">
              {formatCurrency(expense.amount, currency)}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
              {expense.category}
            </span>
          </div>
          {expense.description && (
            <p className="text-sm text-gray-600 mt-0.5">{expense.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span>Paid by {expense.payer}</span>
            <span>·</span>
            <span>{expense.date}</span>
            <span>·</span>
            <span>{expense.splitType === 'payer-only' ? 'No split' : expense.splitType}</span>
          </div>
        </div>
        <div className="flex gap-1 ml-2">
          <button onClick={() => onEdit(expense)} className="text-gray-400 hover:text-blue-500 p-1">✏️</button>
          <button onClick={() => onDelete(expense.id)} className="text-gray-400 hover:text-red-500 p-1">🗑️</button>
        </div>
      </div>
    </div>
  )
}
