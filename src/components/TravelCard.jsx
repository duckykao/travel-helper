import { useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/formatters'

export default function TravelCard({ travel, onDelete }) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{travel.name}</h3>
          <p className="text-sm text-gray-500">
            {formatDate(travel.date)} – {formatDate(travel.endDate)}
          </p>
        </div>
        <button
          onClick={() => onDelete(travel.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Delete travel"
        >
          🗑️
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {travel.members?.map(m => (
          <span key={m} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
            {m}
          </span>
        ))}
      </div>

      <button
        onClick={() => navigate(`/travel/${travel.id}`)}
        className="w-full mt-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
      >
        Enter Trip
      </button>
    </div>
  )
}
