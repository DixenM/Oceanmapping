import { Waves, Menu, Info } from 'lucide-react'
import SearchBar from './SearchBar'

/**
 * Header Component
 * Top navigation bar with branding, search, and menu
 */
const Header = ({ onStationSelect, onInfoClick }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-[999] bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 min-w-fit">
            <Waves className="w-6 h-6 text-ocean-400" />
            <h1 className="text-lg font-bold text-white hidden sm:block">
              Denmark Tide Map
            </h1>
            <h1 className="text-lg font-bold text-white sm:hidden">
              Tides
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <SearchBar onStationSelect={onStationSelect} />
          </div>

          {/* Info Button */}
          <button
            onClick={onInfoClick}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Information"
          >
            <Info className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
