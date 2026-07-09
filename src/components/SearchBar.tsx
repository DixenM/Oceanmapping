import React, { useState, useCallback } from 'react'
import { danishTideStations } from '../data/stations'
import { TideStation } from '../types'
import '../styles/SearchBar.css'

interface SearchBarProps {
  onStationSelect: (station: TideStation) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onStationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<TideStation[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)

    if (value.length > 0) {
      const filtered = danishTideStations.filter(station =>
        station.name.toLowerCase().includes(value.toLowerCase()) ||
        station.city.toLowerCase().includes(value.toLowerCase()) ||
        station.region.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [])

  const handleSelectStation = useCallback((station: TideStation) => {
    setSearchTerm(station.name)
    setShowSuggestions(false)
    onStationSelect(station)
  }, [onStationSelect])

  const handleClear = useCallback(() => {
    setSearchTerm('')
    setSuggestions([])
    setShowSuggestions(false)
  }, [])

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search stations or cities..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm && setShowSuggestions(true)}
          className="search-input"
        />
        {searchTerm && (
          <button onClick={handleClear} className="clear-button">
            ✕
          </button>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map(station => (
            <div
              key={station.id}
              className="suggestion-item"
              onClick={() => handleSelectStation(station)}
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
