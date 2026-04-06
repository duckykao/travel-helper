import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { extractCoords } from '../../utils/mapUtils'

function parseMapsUrl(str) {
  try {
    const url = new URL(str)
    if (!url.hostname.includes('google.com') && !url.hostname.includes('goo.gl')) return null
    const placeMatch = url.pathname.match(/\/maps\/place\/([^/@]+)/)
    if (placeMatch) return { name: decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')), url: str }
    const q = url.searchParams.get('q')
    if (q) return { name: q, url: str }
    return { name: null, url: str }
  } catch { return null }
}

export default function ScheduleItem({ item, onEdit, onDelete, onAddExpense, onMove, selected, onSelect, onToggleLandmark, showAllLandmarks }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`bg-white rounded-xl border p-4 flex gap-3 ${selected ? 'border-blue-400 ring-2 ring-blue-400' : 'border-gray-100'}`}>
      <button
        className="flex items-start pt-0.5 text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none"
        {...attributes}
        {...listeners}
        tabIndex={-1}
        aria-label="Drag to reorder"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
          <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
          <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
        </svg>
      </button>
      <div className="flex-1 flex gap-3 min-w-0 cursor-pointer" onClick={onSelect}>
      {item.startTime && (
        <div className="flex flex-col items-center min-w-[3rem] text-xs text-gray-500">
          <span>{item.startTime}</span>
          {item.endTime && (
            <>
              <div className="w-px flex-1 bg-gray-200 my-1" />
              <span>{item.endTime}</span>
            </>
          )}
        </div>
      )}
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.title}</h4>
        {item.location && (() => {
          const maps = parseMapsUrl(item.location)
          return maps ? (
            <a href={maps.url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-500 mt-0.5 hover:underline block">
              📍 {maps.name || 'View on Google Maps'} ↗
            </a>
          ) : (
            <p className="text-xs text-gray-500 mt-0.5">📍 {item.location}</p>
          )
        })()}
        {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
      </div>
      </div>
      <div className="flex flex-col gap-1">
        {extractCoords(item.location) && (
          <button
            onClick={() => onToggleLandmark(item)}
            className={`p-1.5 rounded-lg transition-colors ${showAllLandmarks || item.showLandmark ? 'bg-blue-100 text-blue-500' : 'bg-gray-50 text-gray-300 hover:bg-blue-50 hover:text-blue-400'}`}
            title={item.showLandmark ? 'Hide landmark' : 'Show as landmark'}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </button>
        )}
        <button onClick={() => onMove(item)}
          className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-500 transition-colors"
          title="Move to another day">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
            <polyline points="9 16 12 19 15 16"/>
            <line x1="12" y1="13" x2="12" y2="19"/>
          </svg>
        </button>
        <button onClick={() => onEdit(item)}
          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button onClick={() => onAddExpense(item)}
          className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-500 transition-colors"
          title="Add expense">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v12M9 9h4.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H15"/>
          </svg>
        </button>
        <button onClick={() => onDelete(item.id)}
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
  )
}
