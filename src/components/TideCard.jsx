import { useQuery } from '@tanstack/react-query'
import { X, Waves, TrendingUp, TrendingDown, Clock, MapPin } from 'lucide-react'
import { fetchTideData } from '../services/tideApi'
import TideChart from './TideChart'

/**
 * TideCard Component
 * Displays detailed tide information for a selected station
 * Shows current tide, next high/low tides, and a 48-hour chart
 */
const TideCard = ({ station, onClose }) => {
  const { data: tideData, isLoading, error } = useQuery({
    queryKey: ['tideData', station.id],
    queryFn: () => fetchTideData(station.lat, station.lon, station.name),
    enabled: !!station
  })

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
      <div className="bg-slate-800 rounded-t-2xl md:rounded-2xl shadow-2xl border border-slate-700 max-h-[85vh] md:max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Waves className="w-5 h-5 text-ocean-400" />
              <h2 className="text-xl font-bold text-white">{station.nameLocal}</h2>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>{station.description}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-400"></div>
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
              <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                <div className="text-sm text-slate-400 mb-2">Current Tide Level</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-ocean-400">
                    {tideData.currentTide.height}
                  </span>
                  <span className="text-lg text-slate-400">{tideData.unit}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  {tideData.currentTide.status === 'rising' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Rising</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400">Falling</span>
                    </>
                  )}
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{formatTime(tideData.currentTide.time)}</span>
                </div>
              </div>

              {/* Next Tides */}
              <div>
                <div className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Upcoming Tides
                </div>
                <div className="space-y-2">
                  {tideData.nextTides.slice(0, 4).map((tide, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-900/30 rounded-lg p-3 border border-slate-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          tide.type === 'high' ? 'bg-green-400' : 'bg-blue-400'
                        }`}></div>
                        <div>
                          <div className="text-sm font-medium text-white capitalize">
                            {tide.type} Tide
                          </div>
                          <div className="text-xs text-slate-400">
                            {formatDate(tide.time)} • {formatTime(tide.time)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-ocean-300">
                          {tide.height}m
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tide Chart */}
              <div>
                <div className="text-sm font-semibold text-slate-300 mb-3">
                  48-Hour Prediction
                </div>
                <div className="bg-slate-900/30 rounded-xl p-3 border border-slate-700/50">
                  <TideChart predictions={tideData.predictions} />
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-800">
                Data source: {tideData.source === 'mock' ? 'Demo (mock data)' : 'WorldTides API'}
                <br />
                Last updated: {formatTime(tideData.lastUpdated)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TideCard
