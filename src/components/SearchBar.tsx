import React, { useState, useCallback } from 'react'
import { danishTideStations } from '../data/stations'
import { TideStation } from '../types'
import '../styles/SearchBar.css'

/**
 * SearchBar component props
 */
interface SearchBarProps {
  iOnStationSelect: (iStation: TideStation) => void
}

/**
 * SearchBar component - Live search and filter for tide stations
 * 
 * Purpose: Allows users to quickly find tide stations by name, city, or region
 * Features live filtering and autocomplete suggestions
 * 
 * Features:
 * - Live search as you type
 * - Filters by name, city, and region
 * - Autocomplete dropdown
 * - Clear button
 * - Keyboard accessible
 * 
 * @param {SearchBarProps} props - Component props
 * @returns {JSX.Element} Search bar component
 */
export const SearchBar: React.FC<SearchBarProps> = ({ iOnStationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<TideStation[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  /**
   * Handles search input changes and filters stations
   * 
   * Purpose: Update suggestions based on user input
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} iEvent - Input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((iEvent: React.ChangeEvent<HTMLInputElement>) => {
    const value = iEvent.target.value
    setSearchTerm(value)

    if (value.length > 0) {
      const lowerValue = value.toLowerCase()
      const filtered = danishTideStations.filter(station =>
        station.name.toLowerCase().includes(lowerValue) ||
        station.city.toLowerCase().includes(lowerValue) ||
        station.region.toLowerCase().includes(lowerValue)
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [])

  /**
   * Handles station selection from suggestions
   * 
   * Purpose: Select a station and notify parent component
   * 
   * @param {TideStation} iStation - Selected station
   * @returns {void}
   */
  const handleSelectStation = useCallback((iStation: TideStation) => {
    setSearchTerm(iStation.name)
    setShowSuggestions(false)
    iOnStationSelect(iStation)
  }, [iOnStationSelect])

  /**
   * Clears the search input and suggestions
   * 
   * Purpose: Reset search state
   * 
   * @returns {void}
   */
  const handleClear = useCallback(() => {
    setSearchTerm('')
    setSuggestions([])
    setShowSuggestions(false)
  }, [])

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          placeholder="Search stations or cities..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          className="search-input"
          aria-label="Search tide stations"
        />
        {searchTerm && (
          <button 
            onClick={handleClear} 
            className="clear-button"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown" role="listbox">
          {suggestions.map(station => (
            <div
              key={station.id}
              className="suggestion-item"
              onClick={() => handleSelectStation(station)}
              role="option"
              aria-selected="false"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelectStation(station)}
            >
              <div className="suggestion-name">{station.name}</div>
              <div className="suggestion-location">{station.city}, {station.region}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
