import { eachDayOfInterval, format, parseISO } from 'date-fns'

export default function DaySelector({ travel, selectedDate, onSelect }) {
  if (!travel?.date || !travel?.endDate) return null

  const days = eachDayOfInterval({
    start: parseISO(travel.date),
    end: parseISO(travel.endDate),
  })

  return (
    <div className="overflow-x-auto -mx-4 px-4 mb-4">
      <div className="flex gap-2 min-w-max pb-1">
        {days.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isSelected = selectedDate === dateStr
          return (
            <button
              key={dateStr}
              onClick={() => onSelect(dateStr)}
              className={`flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              <span className="text-xs opacity-75">Day {i + 1}</span>
              <span>{format(day, 'MMM d')}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
