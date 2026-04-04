import { formatCurrency } from '../../utils/formatters'

export default function ExpenseItem({ expense, currency, categories = [], onEdit, onDelete }) {
  const cat = categories.find(c => c.label === expense.category)
  const catIcon = cat?.icon || ''

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-semibold text-gray-900">
              {formatCurrency(expense.amount, currency)}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
              {catIcon && <span className="mr-0.5">{catIcon}</span>}{expense.category}
            </span>
          </div>
          {expense.description && (
            <p className="text-sm text-gray-600 mt-0.5">{expense.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 flex-wrap">
            <span>Paid by {expense.payer}</span>
            <span>·</span>
            <span>{expense.date}</span>
            <span>·</span>
            <span>{expense.splitType === 'payer-only' ? 'No split' : expense.splitType}</span>
          </div>
          {expense.scheduleName && (
            <p className="mt-1 text-xs text-blue-500">🗓️ {expense.scheduleName}</p>
          )}
        </div>
        <div className="flex gap-1 ml-2">
          <button onClick={() => onEdit(expense)}
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button onClick={() => onDelete(expense.id)}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
