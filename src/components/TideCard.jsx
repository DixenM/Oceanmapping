import { useQuery, useQueryClient } from '@tanstack/react-query'
import { X, Waves, TrendingUp, TrendingDown, Clock, MapPin, RefreshCw } from 'lucide-react'
import { fetchTideData } from '../services/tideService'
import TideChart from './TideChart'

/**
 * TideCard Component
 * Displays detailed tide information for a selected station
 * 
 * Features:
 * - Real-time data from WorldTides API
 * - Loading states with spinner
 * - Refresh button to update data
 * - Color-coded tide levels (low/normal/high)
 * - Rising/falling indicators
 * - Next 4 high/low tides
 * - Interactive 24h/48h chart
 * - Smooth animations
 */
const TideCard = ({ station, onClose }) => {
  const queryClient = useQueryClient()
  
  const { data: tideData, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ['tideData', station.id],
    queryFn: () => fetchTideData(station.lat, station.lon, station.name),
    enabled: !!station,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  })

  /**
   * Get color class based on tide height
   * Low tides: blue, Normal: cyan, High: green/yellow
   */
  const getTideColor = (height, range) => {
    if (!range) return 'text-ocean-400'
    
    const { min, max, average } = range
    const normalizedHeight = (height - min) / (max - min)
    
    if (normalizedHeight < 0.25) return 'text-blue-400' // Very low
    if (normalizedHeight < 0.4) return 'text-cyan-400' // Low
    if (normalizedHeight < 0.6) return 'text-ocean-400' // Normal
    if (normalizedHeight < 0.75) return 'text-emerald-400' // High
    return 'text-yellow-400' // Very high
  }

  /**
   * Handle manual refresh of tide data
   */
  const handleRefresh = () => {
    refetch()
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('da-DK', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('da-DK', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (!station) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1000] md:absolute md:top-4 md:right-4 md:bottom-auto md:left-auto md:w-96">
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden -z-10"
        onClick={onClose}
      />
      
      <div className="bg-slate-800 rounded-t-2xl md:rounded-2xl shadow-2xl border border-slate-700 max-h-[85vh] md:max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
        {/* Drag handle for mobile */}
        <div className="flex justify-center pt-2 pb-1 md:hidden">
          <div className="w-10 h-1 bg-slate-600 rounded-full" />
        </div>
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Waves className="w-6 h-6 text-ocean-400" />
              <h2 className="text-2xl font-bold text-white">{station.nameLocal}</h2>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>{station.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh data"
              title="Refresh tide data"
            >
              <RefreshCw className={`w-5 h-5 text-slate-400 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-ocean-400"></div>
              <p className="text-sm text-slate-400 animate-pulse">Loading tide data...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-200 text-sm">
              Failed to load tide data. Please try again.
            </div>
          )}

          {tideData && (
            <>
              {/* Current Tide */}
              <div className="bg-gradient-to-br from-slate-900/70 to-slate-900/50 rounded-xl p-5 border border-slate-700 shadow-lg">
                <div className="text-sm font-medium text-slate-300 mb-3 flex items-center justify-between">
                  <span>Current Tide Level</span>
                  {tideData.source === 'worldtides' && (
                    <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full border border-green-700/50">
                      Live Data
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className={`text-5xl font-bold ${getTideColor(tideData.currentTide.height, tideData.tideRange)}`}>
                    {tideData.currentTide.height}
                  </span>
                  <span className="text-xl text-slate-400">{tideData.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    {tideData.currentTide.status === 'rising' ? (
                      <>
                        <div className="flex items-center gap-1.5 bg-green-900/30 px-2.5 py-1 rounded-lg border border-green-700/50">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-medium">Rising</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 bg-blue-900/30 px-2.5 py-1 rounded-lg border border-blue-700/50">
                          <TrendingDown className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-medium">Falling</span>
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-sm text-slate-400">{formatTime(tideData.currentTide.time)}</span>
                </div>
              </div>

              {/* Next Tides */}
              <div>
                <div className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-ocean-400" />
                  Next 4 High/Low Tides
                </div>
                <div className="space-y-2">
                  {tideData.nextTides.slice(0, 4).map((tide, idx) => {
                    const isHigh = tide.type === 'high' || tide.type === 'High'
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-lg p-3 border transition-all ${
                          isHigh
                            ? 'bg-green-900/20 border-green-700/50 hover:bg-green-900/30'
                            : 'bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            isHigh ? 'bg-green-400 shadow-lg shadow-green-500/50' : 'bg-blue-400 shadow-lg shadow-blue-500/50'
                          }`}></div>
                          <div>
                            <div className={`text-sm font-semibold capitalize ${
                              isHigh ? 'text-green-300' : 'text-blue-300'
                            }`}>
                              {isHigh ? 'High' : 'Low'} Tide
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {formatDate(tide.time)} • {formatTime(tide.time)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            isHigh ? 'text-green-300' : 'text-blue-300'
                          }`}>
                            {typeof tide.height === 'number' ? tide.height.toFixed(2) : tide.height}m
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tide Chart */}
              <div>
                <div className="text-sm font-semibold text-slate-300 mb-3">
                  Tide Height Prediction
                </div>
                <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-700/50">
                  <TideChart predictions={tideData.predictions} />
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-800">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    tideData.source === 'worldtides' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                  }`}></span>
                  <span>
                    {tideData.source === 'mock' ? 'Demo (mock data)' : 'WorldTides API'}
                  </span>
                </div>
                <span>Last updated: {formatTime(tideData.lastUpdated)}</span>
                {tideData.tideRange && (
                  <div className="mt-1 text-slate-600">
                    Range: {tideData.tideRange.min.toFixed(2)}m - {tideData.tideRange.max.toFixed(2)}m
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TideCard
