import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import bcrypt from 'bcryptjs'
import { useTravel } from '../hooks/useTravel'
import { useTravelContext } from '../context/TravelContext'

export default function PasswordGate() {
  const { travelId } = useParams()
  const navigate = useNavigate()
  const { travel, loading } = useTravel(travelId)
  const { isUnlocked, unlockTravel, setCurrentTravel } = useTravelContext()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (isUnlocked(travelId)) {
      navigate(`/travel/${travelId}/itinerary`, { replace: true })
    }
  }, [travelId, isUnlocked, navigate])

  useEffect(() => {
    if (travel) setCurrentTravel(travel)
  }, [travel, setCurrentTravel])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!travel) return
    setChecking(true)
    setError('')
    try {
      const match = await bcrypt.compare(password, travel.passwordHash)
      if (match) {
        unlockTravel(travelId)
        navigate(`/travel/${travelId}/itinerary`, { replace: true })
      } else {
        setError('Incorrect password. Please try again.')
      }
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!travel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Trip not found.</p>
          <button onClick={() => navigate('/')} className="mt-4 text-blue-600 underline">Go home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900">{travel.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Enter the trip password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
            autoFocus
          />

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={checking || !password}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {checking ? 'Checking...' : 'Enter Trip'}
          </button>

          <button type="button" onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-gray-700 text-center">
            ← Back to trips
          </button>
        </form>
      </div>
    </div>
  )
}
