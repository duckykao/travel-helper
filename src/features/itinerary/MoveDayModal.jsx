import { eachDayOfInterval, format, parseISO } from 'date-fns'
import Modal from '../../components/Modal'

export default function MoveDayModal({ open, onClose, onConfirm, travel, currentDate }) {
  if (!travel?.date || !travel?.endDate) return null

  const days = eachDayOfInterval({
    start: parseISO(travel.date),
    end: parseISO(travel.endDate),
  })

  return (
    <Modal open={open} onClose={onClose} title="Move to Another Day">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-500">Select the day to move this item to:</p>
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
          {days.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const isCurrent = dateStr === currentDate
            return (
              <button
                key={dateStr}
                disabled={isCurrent}
                onClick={() => { onConfirm(dateStr); onClose() }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <span>{format(day, 'EEEE, MMMM d')}</span>
                <span className="text-xs text-gray-400">
                  {isCurrent ? 'Current' : `Day ${i + 1}`}
                </span>
              </button>
            )
          })}
        </div>
        <button onClick={onClose}
          className="py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200">
          Cancel
        </button>
      </div>
    </Modal>
  )
}
