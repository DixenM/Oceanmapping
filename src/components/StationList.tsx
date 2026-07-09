import React, { useState } from 'react'
import { TideStation } from '../types'
import '../styles/StationList.css'

interface StationListProps {
  stations: TideStation[]
  onStationSelect: (station: TideStation) => void
}

export const StationList: React.FC<StationListProps> = ({ 
  stations, 
  onStationSelect 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleList = () => {
    setIsOpen(!isOpen)
  }

  const handleStationClick = (station: TideStation) => {
    onStationSelect(station)
    setIsOpen(false)
  }

  const stationsByRegion = stations.reduce((acc, station) => {
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
      >
        <span className="toggle-icon">{isOpen ? '✕' : '☰'}</span>
        <span className="toggle-text">Stations</span>
      </button>

      <div className={`station-list-panel ${isOpen ? 'open' : ''}`}>
        <div className="station-list-header">
          <h2>Danish Tide Stations</h2>
          <span className="station-count">{stations.length} locations</span>
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

      {isOpen && <div className="station-list-backdrop" onClick={toggleList} />}
    </>
  )
}
