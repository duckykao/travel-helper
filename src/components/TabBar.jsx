import { NavLink, useParams } from 'react-router-dom'

export const tabs = [
  { label: 'Itinerary', path: 'itinerary', icon: '🗓️' },
  { label: 'Expenses', path: 'expenses', icon: '💰' },
  { label: 'Stats', path: 'stats', icon: '📊' },
]

export default function TabBar() {
  const { travelId } = useParams()
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-40">
      {tabs.map(tab => (
        <NavLink
          key={tab.path}
          to={`/travel/${travelId}/${tab.path}`}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
              isActive ? 'text-blue-600' : 'text-gray-500'
            }`
          }
        >
          <span className="text-xl mb-0.5">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
