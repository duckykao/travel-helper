import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { extractCoords, computeMapPosition } from '../../utils/mapUtils'
import TravelMap from './TravelMap'
import { useItinerary } from '../../hooks/useItinerary'
import { useExpenses } from '../../hooks/useExpenses'
import { useCategories } from '../../hooks/useCategories'
import { useTravelContext } from '../../context/TravelContext'
import DaySelector from './DaySelector'
import ScheduleItem from './ScheduleItem'
import ScheduleForm from './ScheduleForm'
import ScheduleExpensesModal from './ScheduleExpensesModal'
import MoveDayModal from './MoveDayModal'
import ConfirmDialog from '../../components/ConfirmDialog'
import ExpenseForm from '../expenses/ExpenseForm'

export default function ItineraryPage() {
  const { travelId } = useParams()
  const { currentTravel } = useTravelContext()
  const { items, addItem, updateItem, deleteItem, reorderItems } = useItinerary(travelId)
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses(travelId)
  const { categories } = useCategories(travelId)
  const members = currentTravel?.members || []
  const currency = currentTravel?.currency || 'USD'

  const storageKey = `it-${travelId}`
  const [selectedDate, setSelectedDate] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}').date || '' } catch { return '' }
  })
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [moveTarget, setMoveTarget] = useState(null)
  const [mapOpen, setMapOpen] = useState(true)
  const [selectedScheduleId, setSelectedScheduleId] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}').scheduleId || null } catch { return null }
  })

  const dayItems = items.filter(i => i.date === selectedDate)

  const homeCoords = extractCoords(currentTravel?.homeLocation)
  // Ignore stale selection from a different day so the map never briefly flies to the wrong spot
  const effectiveScheduleId = dayItems.some(i => i.id === selectedScheduleId) ? selectedScheduleId : null
  const currentPosition = computeMapPosition(items, effectiveScheduleId, homeCoords)
  const dayPins = dayItems
    .map(i => ({ ...i, coords: extractCoords(i.location) }))
    .filter(i => i.coords)

  // Persist selected day + schedule across reloads
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ date: selectedDate, scheduleId: selectedScheduleId }))
  }, [selectedDate, selectedScheduleId, storageKey])

  // Auto-select first pinnable item when user switches days (skip on initial mount)
  const initialMountRef = useRef(true)
  useEffect(() => {
    if (initialMountRef.current) { initialMountRef.current = false; return }
    const first = items
      .filter(i => i.date === selectedDate)
      .find(i => extractCoords(i.location))
    setSelectedScheduleId(first?.id || null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  // Schedule expenses modal state
  const [expenseForItem, setExpenseForItem] = useState(null)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseDeleteTarget, setExpenseDeleteTarget] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const oldIndex = dayItems.findIndex(i => i.id === active.id)
    const newIndex = dayItems.findIndex(i => i.id === over.id)
    const reordered = arrayMove(dayItems, oldIndex, newIndex)
    reorderItems(reordered.map(i => i.id))
  }

  async function handleSubmit(data) {
    if (editItem) {
      await updateItem(editItem.id, data)
    } else {
      await addItem(data)
    }
    setEditItem(null)
  }

  function openEdit(item) {
    setEditItem(item)
    setShowForm(true)
  }

  async function handleExpenseSubmit(data) {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data)
    } else {
      await addExpense(data)
    }
    setEditingExpense(null)
  }

  function handleSelect(id) {
    setSelectedScheduleId(prev => prev === id ? null : id)
  }

  return (
    <div>
      <TravelMap
        open={mapOpen}
        onToggle={() => setMapOpen(o => !o)}
        position={currentPosition}
        pins={dayPins}
        homeCoords={homeCoords}
        noLocations={!!selectedDate && dayPins.length === 0}
      />

      {currentTravel && (
        <DaySelector
          travel={currentTravel}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-500">
          {selectedDate ? format(parseISO(selectedDate), 'EEEE, MMMM d') : 'Select a day'}
        </h2>
        <button
          onClick={() => { setEditItem(null); setShowForm(true) }}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      {dayItems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-3xl mb-2">🗓️</div>
          <p className="text-sm">No schedule for this day yet.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={dayItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {dayItems.map(item => (
                <ScheduleItem
                  key={item.id}
                  item={item}
                  selected={item.id === effectiveScheduleId}
                  onSelect={() => handleSelect(item.id)}
                  onEdit={openEdit}
                  onDelete={id => setDeleteTarget(id)}
                  onAddExpense={item => setExpenseForItem(item)}
                  onMove={item => setMoveTarget(item)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ScheduleForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditItem(null) }}
        onSubmit={handleSubmit}
        editItem={editItem}
        selectedDate={selectedDate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteItem(deleteTarget)}
        title="Delete Schedule Item"
        message="Remove this schedule item?"
      />

      <ScheduleExpensesModal
        open={!!expenseForItem && !showExpenseForm}
        onClose={() => setExpenseForItem(null)}
        item={expenseForItem}
        expenses={expenses}
        categories={categories}
        currency={currency}
        onAdd={() => { setEditingExpense(null); setShowExpenseForm(true) }}
        onEdit={expense => { setEditingExpense(expense); setShowExpenseForm(true) }}
        onDelete={id => setExpenseDeleteTarget(id)}
      />

      <ExpenseForm
        open={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        onSubmit={handleExpenseSubmit}
        editExpense={editingExpense}
        members={members}
        categories={categories}
        currency={currency}
        itineraryItems={items}
        initialScheduleId={expenseForItem?.id || ''}
      />

      <ConfirmDialog
        open={!!expenseDeleteTarget}
        onClose={() => setExpenseDeleteTarget(null)}
        onConfirm={() => deleteExpense(expenseDeleteTarget)}
        title="Delete Expense"
        message="Remove this expense?"
      />

      <MoveDayModal
        open={!!moveTarget}
        onClose={() => setMoveTarget(null)}
        onConfirm={newDate => updateItem(moveTarget.id, { date: newDate })}
        travel={currentTravel}
        currentDate={moveTarget?.date}
      />
    </div>
  )
}
