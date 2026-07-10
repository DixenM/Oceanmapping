import React from 'react'
import { TideStation } from '../types'
import { useTideData } from '../hooks/useTideData'
import { formatHeight, formatDateTime } from '../utils/helpers'
import '../styles/TideInfoPopup.css'

/**
 * TideInfoPopup component props
 */
interface TideInfoPopupProps {
  iStation: TideStation
  iOnClose: () => void
}

/**
 * TideInfoPopup component - Displays detailed tide information for a station
 * 
 * Purpose: Shows current tide height, status (rising/falling), and upcoming
 * high/low tides in a modal popup overlay
 * 
 * Features:
 * - Real-time tide data with TanStack Query
 * - Automatic caching and refetching
 * - Loading skeleton
 * - Error handling
 * - Color-coded tide status
 * - Upcoming tide extremes
 * 
 * @param {TideInfoPopupProps} props - Component props
 * @returns {JSX.Element} Tide information popup
 */
export const TideInfoPopup: React.FC<TideInfoPopupProps> = ({ 
  iStation, 
  iOnClose 
}) => {
  const { data: tideInfo, isLoading: loading, error } = useTideData(
    iStation.latitude,
    iStation.longitude
  )

  return (
    <div className="tide-info-popup">
      <div className="popup-header">
        <div>
          <h2>{iStation.name}</h2>
          <p className="station-location">{iStation.city}, {iStation.region}</p>
        </div>
        <button 
          onClick={iOnClose} 
          className="close-button"
          aria-label="Close tide information"
        >
          ✕
        </button>
      </div>

      {loading && (
        <div className="popup-loading">
          <div className="spinner" />
          <p>Loading tide data...</p>
        </div>
      )}

      {error && (
        <div className="popup-error">
          <p>⚠️ Failed to load tide data. Please try again.</p>
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
