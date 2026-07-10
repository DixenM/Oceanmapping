import React, { useState } from 'react'
import { TideStation } from '../types'
import '../styles/StationList.css'

/**
 * StationList component props
 */
interface StationListProps {
  iStations: TideStation[]
  iOnStationSelect: (iStation: TideStation) => void
}

/**
 * StationList component - Toggleable panel displaying all tide stations
 * 
 * Purpose: Shows a collapsible side panel with all available tide monitoring stations
 * organized by region for easy browsing and selection
 * 
 * Features:
 * - Toggleable sidebar panel
 * - All 15 Danish tide stations
 * - Grouped by region
 * - Click to select station
 * - Backdrop overlay when open
 * - Station count indicator
 * - Mobile-friendly design
 * 
 * @param {StationListProps} props - Component props
 * @returns {JSX.Element} Station list component with toggle
 */
export const StationList: React.FC<StationListProps> = ({ 
  iStations, 
  iOnStationSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  /**
   * Toggles the station list panel open/closed
   * 
   * Purpose: Show/hide the stations panel
   * 
   * @returns {void}
   */
  const toggleList = (): void => {
    setIsOpen(!isOpen)
  }

  /**
   * Handles station selection from list
   * 
   * Purpose: Select a station, notify parent, and close the panel
   * 
   * @param {TideStation} iStation - Selected station
   * @returns {void}
   */
  const handleStationClick = (iStation: TideStation): void => {
    iOnStationSelect(iStation)
    setIsOpen(false)
  }

  /**
   * Handles keyboard selection (Enter or Space key)
   * 
   * Purpose: Allow keyboard navigation and selection
   * 
   * @param {React.KeyboardEvent} iEvent - Keyboard event
   * @param {TideStation} iStation - Station to select
   * @returns {void}
   */
  const handleKeyDown = (iEvent: React.KeyboardEvent, iStation: TideStation): void => {
    if (iEvent.key === 'Enter' || iEvent.key === ' ') {
      iEvent.preventDefault()
      handleStationClick(iStation)
    }
  }

  // Group stations by region for better organization
  const stationsByRegion = iStations.reduce((acc, station) => {
    if (!acc[station.region]) {
      acc[station.region] = []
    }
    acc[station.region].push(station)
    return acc
  }, {} as Record<string, TideStation[]>)

  return (
    <>
      <button
        className={`station-list-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleList}
        aria-label={isOpen ? 'Close stations list' : 'Open stations list'}
        aria-expanded={isOpen}
      >
        <span className="toggle-icon" aria-hidden="true">{isOpen ? '✕' : '☰'}</span>
        <span className="toggle-text">Stations</span>
      </button>

      <div 
        className={`station-list-panel ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Tide stations list"
      >
        <div className="station-list-header">
          <h2>Danish Tide Stations</h2>
          <span className="station-count">{iStations.length} locations</span>
        </div>
        
        <div className="station-list-content">
          {Object.entries(stationsByRegion).map(([region, regionStations]) => (
            <div key={region} className="station-region">
              <h3 className="region-title">{region}</h3>
              <div className="region-stations">
                {regionStations.map(station => (
                  <div
                    key={station.id}
                    className="station-item"
                    onClick={() => handleStationClick(station)}
                    onKeyDown={(e) => handleKeyDown(e, station)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${station.name} tide station in ${station.city}`}
                  >
                    <div className="station-name">📍 {station.name}</div>
                    <div className="station-city">{station.city}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <div 
          className="station-list-backdrop" 
          onClick={toggleList}
          aria-label="Close stations list"
          role="button"
          tabIndex={-1}
        />
      )}
    </>
  )
}
