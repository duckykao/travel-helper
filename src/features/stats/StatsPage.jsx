import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useExpenses } from '../../hooks/useExpenses'
import { useCategories } from '../../hooks/useCategories'
import { useTravelContext } from '../../context/TravelContext'
import { computeCategoryTotals, computeMemberCategoryTotals } from '../../utils/splitCalc'
import { formatCurrency } from '../../utils/formatters'
import PieChart from './PieChart'
import MemberFilter from './MemberFilter'

export default function StatsPage() {
  const { travelId } = useParams()
  const { currentTravel } = useTravelContext()
  const { expenses } = useExpenses(travelId)
  const { categories } = useCategories(travelId)
  const [selectedMember, setSelectedMember] = useState(null)

  const members = currentTravel?.members || []
  const currency = currentTravel?.currency || 'USD'

  const chartData = selectedMember
    ? computeMemberCategoryTotals(expenses, categories, selectedMember)
    : computeCategoryTotals(expenses, categories)

  const total = chartData.reduce((sum, d) => sum + d.total, 0)

  return (
    <div>
      <MemberFilter members={members} selected={selectedMember} onSelect={setSelectedMember} />

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <p className="text-xs text-gray-500 mb-1">
          {selectedMember ? `${selectedMember}'s expenses` : 'Total trip expenses'}
        </p>
        <p className="text-2xl font-bold text-gray-900 mb-4">{formatCurrency(total, currency)}</p>
        <div className="max-w-xs mx-auto">
          <PieChart data={chartData} />
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Breakdown</h3>
          <div className="flex flex-col gap-2">
            {chartData.sort((a, b) => b.total - a.total).map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(item.total, currency)}</span>
                <span className="text-xs text-gray-400 w-10 text-right">
                  {total > 0 ? Math.round((item.total / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
