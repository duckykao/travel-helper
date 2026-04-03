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
        <button onClick={() => onEdit(item)} className="text-gray-400 hover:text-blue-500 text-xs px-1">✏️</button>
        <button onClick={() => onDelete(item.id)} className="text-gray-400 hover:text-red-500 text-xs px-1">🗑️</button>
      </div>
    </div>
  )
}
