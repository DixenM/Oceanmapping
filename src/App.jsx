import { useState, useEffect } from 'react';
import Map, { DEFAULT_STATIONS } from './components/Map';
import TideBottomSheet from './components/TideBottomSheet';
import StationDetail from './components/StationDetail';
import { fetchMarineWeather } from './services/marineWeatherService';
import { fetchTideData } from './services/tideService';
import './App.css';

function App() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showWaveOverlay, setShowWaveOverlay] = useState(false);
  const [marineData, setMarineData] = useState({});
  const [tideData, setTideData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllStationsData();
  }, []);

  const loadAllStationsData = async () => {
    try {
      const dataPromises = DEFAULT_STATIONS.map(async (station) => {
        try {
          const marine = await fetchMarineWeather(station.lat, station.lon);
          return { id: station.id, data: marine };
        } catch (error) {
          console.error(`Error loading data for ${station.name}:`, error);
          return { id: station.id, data: null };
        }
      });

      const results = await Promise.all(dataPromises);
      const newMarineData = {};
      results.forEach(result => {
        if (result.data) {
          newMarineData[result.id] = result.data;
        }
      });
      setMarineData(newMarineData);
    } catch (error) {
      console.error('Error loading stations data:', error);
    }
  };

  const handleStationClick = async (station) => {
    setLoading(true);
    setSelectedStation(station);
    
    try {
      let marine = marineData[station.id];
      
      if (!marine) {
        marine = await fetchMarineWeather(station.lat, station.lon);
        setMarineData(prev => ({ ...prev, [station.id]: marine }));
      }
      
      const tide = await fetchTideData(station.lat, station.lon);
      setTideData(tide);
    } catch (error) {
      console.error('Error loading station data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBottomSheet = () => {
    setSelectedStation(null);
    setTideData(null);
  };

  const handleExpandToDetail = (station) => {
    setShowDetailView(true);
  };

  const handleCloseDetail = () => {
    setShowDetailView(false);
  };

  const toggleWaveOverlay = () => {
    setShowWaveOverlay(!showWaveOverlay);
  };

  return (
    <div className="app-container">
      <Map 
        onStationClick={handleStationClick}
        showWaveOverlay={showWaveOverlay}
        marineData={marineData}
      />
      
      <button 
        className={`wave-overlay-toggle ${showWaveOverlay ? 'active' : ''}`}
        onClick={toggleWaveOverlay}
      >
        <span>{showWaveOverlay ? '🌊' : '🗺️'}</span>
        <span>{showWaveOverlay ? 'Wave Overlay ON' : 'Show Wave Overlay'}</span>
      </button>

      {selectedStation && !showDetailView && (
        <TideBottomSheet
          station={selectedStation}
          marineWeather={marineData[selectedStation.id]}
          tideData={tideData}
          onClose={handleCloseBottomSheet}
          onExpand={handleExpandToDetail}
        />
      )}

      {showDetailView && selectedStation && (
        <StationDetail
          station={selectedStation}
          marineWeather={marineData[selectedStation.id]}
          tideData={tideData}
          onClose={handleCloseDetail}
        />
      )}

      {loading && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 3000
        }}>
          Loading station data...
        </div>
      )}
    </div>
  );
}

export default App;
