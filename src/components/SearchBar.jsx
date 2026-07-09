import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { danishStations } from '../data/danishStations'

/**
 * SearchBar Component
 * Allows users to search for tide stations by name, location, or region
 * 
 * Features:
 * - Live filtering as user types
 * - Searches across name, description, and region
 * - Keyboard navigation support
 * - Automatically closes when clicking outside
 * - Triggers map animation to selected station
 */
const SearchBar = ({ onStationSelect }) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredStations, setFilteredStations] = useState([])
  const searchRef = useRef(null)

  /**
   * Filter stations based on search query
   * Searches across multiple fields for better matches
   */
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredStations([])
      setIsOpen(false)
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = danishStations.filter(station => 
      station.name.toLowerCase().includes(lowerQuery) ||
      station.nameLocal.toLowerCase().includes(lowerQuery) ||
      station.description.toLowerCase().includes(lowerQuery) ||
      station.region.toLowerCase().includes(lowerQuery)
    )

    setFilteredStations(filtered)
    setIsOpen(filtered.length > 0)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /**
   * Handle station selection from search results
   * Triggers parent callback to show tide info and fly to location
   */
  const handleStationClick = (station) => {
    onStationSelect(station)
    setQuery('')
    setIsOpen(false)
  }

  const handleClear = () => {
    setQuery('')
    setFilteredStations([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tide stations..."
          className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {isOpen && filteredStations.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
          {filteredStations.map((station) => (
            <button
              key={station.id}
              onClick={() => handleStationClick(station)}
              className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-700/50 last:border-b-0 focus:outline-none focus:bg-slate-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-white">{station.nameLocal}</div>
                  <div className="text-sm text-slate-400 mt-1">{station.description}</div>
                </div>
                <div className="text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                  {station.region}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
