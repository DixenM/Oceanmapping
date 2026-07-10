import React, { useState, useMemo } from 'react'
import { TideStation } from '../types'
import { useFavorites } from '../hooks/useFavorites'
import '../styles/StationList.css'

/**
 * Filter types for station list
 */
type FilterType = 'all' | 'favorites'

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
  const [filterType, setFilterType] = useState<FilterType>('all')
  
  const { oIsFavorite, oToggleFavorite, oFavoriteCount, oFavorites } = useFavorites()

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
   * Handles favorite button click
   * 
   * Purpose: Toggle favorite status without triggering station selection
   * 
   * @param {React.MouseEvent} iEvent - Mouse event
   * @param {string} iStationId - Station ID to toggle
   * @returns {void}
   */
  const handleFavoriteClick = (iEvent: React.MouseEvent, iStationId: string): void => {
    iEvent.stopPropagation() // Prevent station selection
    oToggleFavorite(iStationId)
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

  /**
   * Filters and sorts stations based on current filter and favorites
   * 
   * Purpose: Show all stations or only favorites, with favorites sorted to top
   * 
   * @returns {TideStation[]} Filtered and sorted stations
   */
  const filteredStations = useMemo(() => {
    let result = iStations

    // Apply favorites filter
    if (filterType === 'favorites') {
      const favoriteIds = new Set(oFavorites.map(fav => fav.stationId))
      result = result.filter(station => favoriteIds.has(station.id))
    }

    // Sort: favorites first, then alphabetically
    return result.sort((a, b) => {
      const aIsFav = oIsFavorite(a.id)
      const bIsFav = oIsFavorite(b.id)

      if (aIsFav && !bIsFav) return -1
      if (!aIsFav && bIsFav) return 1
      return a.name.localeCompare(b.name)
    })
  }, [iStations, filterType, oFavorites, oIsFavorite])

  // Group stations by region for better organization
  const stationsByRegion = filteredStations.reduce((acc, station) => {
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
          <span className="station-count">
            {filterType === 'all' ? iStations.length : oFavoriteCount} locations
          </span>
        </div>

        <div className="station-list-filters">
          <button
            className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
            aria-label="Show all stations"
          >
            All Stations
          </button>
          <button
            className={`filter-button ${filterType === 'favorites' ? 'active' : ''}`}
            onClick={() => setFilterType('favorites')}
            aria-label="Show favorite stations only"
          >
            Favorites {oFavoriteCount > 0 && <span className="filter-badge">{oFavoriteCount}</span>}
          </button>
        </div>
        
        <div className="station-list-content">
          {Object.keys(stationsByRegion).length === 0 && filterType === 'favorites' && (
            <div className="empty-favorites">
              <p>No favorite stations yet</p>
              <p className="empty-favorites-hint">Tap the ♡ icon to add favorites</p>
            </div>
          )}

          {Object.entries(stationsByRegion).map(([region, regionStations]) => (
            <div key={region} className="station-region">
              <h3 className="region-title">{region}</h3>
              <div className="region-stations">
                {regionStations.map(station => {
                  const isFavorited = oIsFavorite(station.id)
                  return (
                    <div
                      key={station.id}
                      className={`station-item ${isFavorited ? 'favorited' : ''}`}
                      onClick={() => handleStationClick(station)}
                      onKeyDown={(e) => handleKeyDown(e, station)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select ${station.name} tide station in ${station.city}`}
                    >
                      <div className="station-info">
                        <div className="station-name">
                          {isFavorited && <span className="favorite-badge">★</span>}
                          📍 {station.name}
                        </div>
                        <div className="station-city">{station.city}</div>
                      </div>
                      <button
                        className={`favorite-button-list ${isFavorited ? 'favorited' : ''}`}
                        onClick={(e) => handleFavoriteClick(e, station.id)}
                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {isFavorited ? '♥' : '♡'}
                      </button>
                    </div>
                  )
                })}
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
