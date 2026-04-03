import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useExpenses } from '../../hooks/useExpenses'
import { useCategories } from '../../hooks/useCategories'
import { useTravelContext } from '../../context/TravelContext'
import { computeSettlements, computeBalances } from '../../utils/splitCalc'
import { formatCurrency } from '../../utils/formatters'
import ExpenseItem from './ExpenseItem'
import ExpenseForm from './ExpenseForm'
import CategoryManager from './CategoryManager'
import ConfirmDialog from '../../components/ConfirmDialog'

export default function ExpensePage() {
  const { travelId } = useParams()
  const { currentTravel } = useTravelContext()
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses(travelId)
  const { categories, addCategory, deleteCategory } = useCategories(travelId)
  const [showForm, setShowForm] = useState(false)
  const [showCatManager, setShowCatManager] = useState(false)
  const [editExpense, setEditExpense] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showSettlements, setShowSettlements] = useState(false)

  const members = currentTravel?.members || []
  const currency = currentTravel?.currency || 'USD'
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)

  const settlements = computeSettlements(computeBalances(expenses, members))

  async function handleSubmit(data) {
    if (editExpense) {
      await updateExpense(editExpense.id, data)
    } else {
      await addExpense(data)
    }
    setEditExpense(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(total, currency)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCatManager(true)}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
            Categories
          </button>
          <button
            onClick={() => { setEditExpense(null); setShowForm(true) }}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700"
          >
            + Add
          </button>
        </div>
      </div>

      {settlements.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <button
            onClick={() => setShowSettlements(!showSettlements)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-sm font-medium text-amber-800">💸 Settlements</span>
            <span className="text-xs text-amber-600">{showSettlements ? '▲ hide' : '▼ show'}</span>
          </button>
          {showSettlements && (
            <div className="mt-2 flex flex-col gap-1">
              {settlements.map((s, i) => (
                <p key={i} className="text-sm text-amber-700">
                  {s.from} → {s.to}: {formatCurrency(s.amount, currency)}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {expenses.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-3xl mb-2">💰</div>
          <p className="text-sm">No expenses yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {expenses.map(e => (
            <ExpenseItem key={e.id} expense={e} currency={currency}
              onEdit={item => { setEditExpense(item); setShowForm(true) }}
              onDelete={id => setDeleteTarget(id)} />
          ))}
        </div>
      )}

      <ExpenseForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditExpense(null) }}
        onSubmit={handleSubmit}
        editExpense={editExpense}
        members={members}
        categories={categories}
        currency={currency}
      />

      <CategoryManager
        open={showCatManager}
        onClose={() => setShowCatManager(false)}
        categories={categories}
        onAdd={addCategory}
        onDelete={deleteCategory}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteExpense(deleteTarget)}
        title="Delete Expense"
        message="Remove this expense?"
      />
    </div>
  )
}
