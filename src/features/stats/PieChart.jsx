import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No data to display
      </div>
    )
  }

  const chartData = {
    labels: data.map(d => d.label),
    datasets: [{
      data: data.map(d => d.total),
      backgroundColor: data.map(d => d.color),
      borderWidth: 2,
      borderColor: '#fff',
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 12, font: { size: 12 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toFixed(2)}`
        }
      }
    }
  }

  return <Doughnut data={chartData} options={options} />
}
