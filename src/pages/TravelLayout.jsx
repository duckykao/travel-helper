import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useTravel } from '../hooks/useTravel'
import { useTravelContext } from '../context/TravelContext'
import TabBar from '../components/TabBar'

export default function TravelLayout() {
  const { travelId } = useParams()
  const navigate = useNavigate()
  const { travel, loading } = useTravel(travelId)
  const { isUnlocked, setCurrentTravel } = useTravelContext()

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
        <div>
          <h1 className="text-base font-semibold text-gray-900">{travel?.name}</h1>
          <p className="text-xs text-gray-500">{travel?.members?.join(', ')}</p>
        </div>
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
    </div>
  )
}
