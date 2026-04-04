import { useState, useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useTravel } from '../hooks/useTravel'
import { useTravelContext } from '../context/TravelContext'
import TabBar from '../components/TabBar'
import TripEditModal from '../components/TripEditModal'

export default function TravelLayout() {
  const { travelId } = useParams()
  const navigate = useNavigate()
  const { travel, loading, updateTravel } = useTravel(travelId)
  const { isUnlocked, setCurrentTravel } = useTravelContext()
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!loading && !isUnlocked(travelId)) {
      navigate(`/travel/${travelId}`, { replace: true })
    }
  }, [loading, travelId, isUnlocked, navigate])

  useEffect(() => {
    if (travel) setCurrentTravel(travel)
  }, [travel, setCurrentTravel])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-gray-900">{travel?.name}</h1>
          <p className="text-xs text-gray-500 truncate max-w-full">
            👥 {travel?.members?.join(', ')}
          </p>
        </div>
        <button onClick={() => setShowEdit(true)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Edit trip">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </header>

      <div className="hidden sm:block max-w-4xl mx-auto px-4 pt-4">
        <TabBar />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-4">
        <Outlet />
      </main>

      <div className="sm:hidden">
        <TabBar />
      </div>

      <TripEditModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        travel={travel}
        onSave={updateTravel}
      />
    </div>
  )
}
