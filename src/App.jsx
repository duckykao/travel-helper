import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TravelProvider } from './context/TravelContext'
import HomePage from './pages/HomePage'
import PasswordGate from './pages/PasswordGate'
import TravelLayout from './pages/TravelLayout'
import ItineraryPage from './features/itinerary/ItineraryPage'
import ExpensePage from './features/expenses/ExpensePage'
import StatsPage from './features/stats/StatsPage'

export default function App() {
  return (
    <TravelProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/travel/:travelId" element={<PasswordGate />} />
          <Route path="/travel/:travelId" element={<TravelLayout />}>
            <Route path="itinerary" element={<ItineraryPage />} />
            <Route path="expenses" element={<ExpensePage />} />
            <Route path="stats" element={<StatsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </TravelProvider>
  )
}
