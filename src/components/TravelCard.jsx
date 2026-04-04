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
          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors"
          aria-label="Delete travel"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
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
