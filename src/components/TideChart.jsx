import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

/**
 * TideChart Component
 * Displays tide prediction charts with 24-hour or 48-hour views
 * 
 * Features:
 * - Beautiful gradient area chart
 * - Interactive tooltips with time and height
 * - Toggle between 24h and 48h views
 * - Responsive design for mobile
 * - Danish time format (24-hour)
 */
const TideChart = ({ predictions }) => {
  const [timeRange, setTimeRange] = useState(24)
  if (!predictions || predictions.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500">
        No chart data available
      </div>
    )
  }

  // Filter data based on selected time range
  const dataPoints = timeRange === 24 
    ? predictions.slice(0, 48)
    : predictions
  
  // Format data for Recharts
  const chartData = dataPoints.map((pred) => {
    const date = new Date(pred.time)
    return {
      time: date.toLocaleTimeString('da-DK', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      date: date.toLocaleDateString('da-DK', { 
        month: 'short', 
        day: 'numeric' 
      }),
      height: pred.height,
      fullTime: date
    }
  })

  // Show fewer ticks to avoid crowding
  const tickInterval = timeRange === 24 ? 6 : 12
  const tickIndices = chartData
    .map((_, idx) => idx)
    .filter((_, idx) => idx % tickInterval === 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 shadow-lg">
          <p className="text-xs text-slate-400">{payload[0].payload.date}</p>
          <p className="text-sm font-semibold text-ocean-300">
            {payload[0].payload.time}
          </p>
          <p className="text-sm font-bold text-white">
            {payload[0].value.toFixed(2)}m
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div>
      {/* Time range toggle */}
      <div className="flex justify-end gap-2 mb-2">
        <button
          onClick={() => setTimeRange(24)}
          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
            timeRange === 24
              ? 'bg-ocean-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          24h
        </button>
        <button
          onClick={() => setTimeRange(48)}
          className={`px-3 py-1 text-xs rounded-lg transition-colors ${
            timeRange === 48
              ? 'bg-ocean-500 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          48h
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="tideGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="time" 
            stroke="#64748b"
            fontSize={10}
            ticks={tickIndices.map(i => chartData[i].time)}
            interval={0}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={11}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `${value.toFixed(1)}m`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="height"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#tideGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TideChart
