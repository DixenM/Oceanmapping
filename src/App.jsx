import { useState } from 'react'
import Map from './components/Map'
import TideCard from './components/TideCard'
import Header from './components/Header'
import InfoModal from './components/InfoModal'

/**
 * Main App Component
 * Denmark Tide Map PWA
 * 
 * Features:
 * - Interactive map of Denmark with tide stations
 * - Click stations to view tide information
 * - Search for stations
 * - 48-hour tide predictions with charts
 * - Mobile-friendly, dark theme
 */
function App() {
  const [selectedStation, setSelectedStation] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  const handleStationClick = (station) => {
    setSelectedStation(station)
  }

  const handleCloseCard = () => {
    setSelectedStation(null)
  }

  const handleStationSelect = (station) => {
    setSelectedStation(station)
  }

  return (
    <div className="w-full h-full bg-slate-900 overflow-hidden">
      <Header 
        onStationSelect={handleStationSelect}
        onInfoClick={() => setShowInfo(true)}
      />
      
      <main className="w-full h-full pt-16">
        <Map 
          onStationClick={handleStationClick}
          selectedStation={selectedStation}
        />
        
        {selectedStation && (
          <TideCard 
            station={selectedStation}
            onClose={handleCloseCard}
          />
        )}

        {showInfo && (
          <InfoModal onClose={() => setShowInfo(false)} />
        )}
      </main>
    </div>
  )
}

export default App
