import { useState } from 'react'
import { useTravels } from '../hooks/useTravels'
import TravelCard from '../components/TravelCard'
import TravelForm from '../components/TravelForm'
import ConfirmDialog from '../components/ConfirmDialog'

export default function HomePage() {
  const { travels, loading, addTravel, deleteTravel } = useTravels()
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [createError, setCreateError] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-xl font-bold text-gray-900">✈️ Travel Helper</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          + New Trip
        </button>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {createError && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3">
            <p className="text-sm text-red-700">Failed to create trip: {createError}</p>
            <button onClick={() => setCreateError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : travels.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌍</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No trips yet</h2>
            <p className="text-gray-500 mb-6">Create your first trip to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700"
            >
              Create Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {travels.map(t => (
              <TravelCard
                key={t.id}
                travel={t}
                onDelete={id => setDeleteTarget(id)}
              />
            ))}
          </div>
        )}
      </main>

      <TravelForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={addTravel}
        onError={setCreateError}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTravel(deleteTarget)}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? All data will be permanently lost."
      />
    </div>
  )
}
