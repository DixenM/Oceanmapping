import React, { useEffect, useState } from 'react'
import { TideInfo, TideStation } from '../types'
import { fetchTideData } from '../services/tideApi'
import { formatHeight, formatDateTime } from '../utils/helpers'
import '../styles/TideInfoPopup.css'

interface TideInfoPopupProps {
  station: TideStation
  onClose: () => void
}

export const TideInfoPopup: React.FC<TideInfoPopupProps> = ({ 
  station, 
  onClose 
}) => {
  const [tideInfo, setTideInfo] = useState<TideInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTideData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await fetchTideData(station.latitude, station.longitude)
        setTideInfo(data)
      } catch (err) {
        setError('Failed to load tide data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadTideData()
  }, [station])

  return (
    <div className="tide-info-popup">
      <div className="popup-header">
        <div>
          <h2>{station.name}</h2>
          <p className="station-location">{station.city}, {station.region}</p>
        </div>
        <button onClick={onClose} className="close-button">✕</button>
      </div>

      {loading && (
        <div className="popup-loading">
          <div className="spinner" />
          <p>Loading tide data...</p>
        </div>
      )}

      {error && (
        <div className="popup-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {tideInfo && !loading && (
        <div className="popup-content">
          <div 
            className="tide-status-banner"
            style={{ backgroundColor: tideInfo.status.color }}
          >
            <span className="status-icon">{tideInfo.status.icon}</span>
            <span className="status-text">{tideInfo.status.message}</span>
          </div>

          <div className="current-tide">
            <h3>Current Conditions</h3>
            <div className="tide-value">
              <span className="value-label">Height:</span>
              <span className="value-text">{formatHeight(tideInfo.current.height)}</span>
            </div>
          </div>

          <div className="tide-extremes">
            <h3>Upcoming Tides</h3>
            <div className="extremes-list">
              {tideInfo.extremes.map((extreme, index) => (
                <div 
                  key={index} 
                  className={`extreme-item ${extreme.type.toLowerCase()}`}
                >
                  <div className="extreme-type">
                    {extreme.type === 'High' ? '⬆️ High' : '⬇️ Low'}
                  </div>
                  <div className="extreme-details">
                    <span className="extreme-time">{formatDateTime(extreme.time)}</span>
                    <span className="extreme-height">{formatHeight(extreme.height)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
