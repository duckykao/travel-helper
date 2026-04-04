export default function ScheduleItem({ item, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3">
      <div className="flex flex-col items-center min-w-[3rem] text-xs text-gray-500">
        <span>{item.startTime || '--:--'}</span>
        {item.endTime && (
          <>
            <div className="w-px flex-1 bg-gray-200 my-1" />
            <span>{item.endTime}</span>
          </>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.title}</h4>
        {item.location && <p className="text-xs text-gray-500 mt-0.5">📍 {item.location}</p>}
        {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <button onClick={() => onEdit(item)}
          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-500 transition-colors">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
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
