import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { useItinerary } from '../../hooks/useItinerary'
import { useTravelContext } from '../../context/TravelContext'
import DaySelector from './DaySelector'
import ScheduleItem from './ScheduleItem'
import ScheduleForm from './ScheduleForm'
import ConfirmDialog from '../../components/ConfirmDialog'

export default function ItineraryPage() {
  const { travelId } = useParams()
  const { currentTravel } = useTravelContext()
  const { items, addItem, updateItem, deleteItem } = useItinerary(travelId)
  const [selectedDate, setSelectedDate] = useState(currentTravel?.date || '')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const dayItems = items.filter(i => i.date === selectedDate)

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

  return (
    <div>
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
        <div className="flex flex-col gap-3">
          {dayItems.map(item => (
            <ScheduleItem
              key={item.id}
              item={item}
              onEdit={openEdit}
              onDelete={id => setDeleteTarget(id)}
            />
          ))}
        </div>
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
    </div>
  )
}
