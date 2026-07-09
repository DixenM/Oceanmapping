import { useState } from 'react';
import { formatWindDirection } from '../services/marineWeatherService';
import { formatTideTime } from '../services/tideService';

function TideBottomSheet({ station, marineWeather, tideData, onClose, onExpand }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!station) return null;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderConditionBadge = () => {
    if (!marineWeather?.conditions) return null;
    
    const { status, warnings } = marineWeather.conditions;
    
    return (
      <div className={`condition-badge ${status}`}>
        <span>
          {status === 'good' && '✓'}
          {status === 'caution' && '⚠'}
          {status === 'dangerous' && '⚠'}
        </span>
        <span>{status.toUpperCase()}</span>
      </div>
    );
  };

  const renderWindArrow = (direction) => {
    return (
      <span 
        className="wind-arrow" 
        style={{ transform: `rotate(${direction}deg)` }}
      >
        ↓
      </span>
    );
  };

  const formatForecastTime = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString('da-DK', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`bottom-sheet ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="bottom-sheet-handle" onClick={toggleCollapse}></div>
      
      <div className="bottom-sheet-content">
        <div className="station-header" onClick={() => onExpand(station)}>
          <h2>{station.name}</h2>
          <button className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            ×
          </button>
        </div>

        {marineWeather && (
          <>
            {renderConditionBadge()}
            
            <div className="section">
              <h3 className="section-title">
                <span>🌊</span>
                Marine Weather
              </h3>
              
              <div className="current-conditions">
                <div className="condition-card">
                  <div className="condition-label">Wave Height</div>
                  <div className="condition-value">
                    {marineWeather.current.waveHeight.toFixed(1)}
                    <span className="condition-unit">m</span>
                  </div>
                </div>
                
                <div className="condition-card">
                  <div className="condition-label">Wind Speed</div>
                  <div className="condition-value">
                    {marineWeather.current.windSpeed.toFixed(0)}
                    <span className="condition-unit">km/h</span>
                    {renderWindArrow(marineWeather.current.windDirection)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {formatWindDirection(marineWeather.current.windDirection)}
                  </div>
                </div>
                
                <div className="condition-card">
                  <div className="condition-label">Wind Wave</div>
                  <div className="condition-value">
                    {marineWeather.current.windWaveHeight.toFixed(1)}
                    <span className="condition-unit">m</span>
                  </div>
                </div>
              </div>

              {marineWeather.conditions && (
                <div style={{ 
                  background: '#f3f4f6', 
                  padding: '12px', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <strong>Conditions:</strong> {marineWeather.conditions.message}
                  {marineWeather.conditions.warnings.length > 0 && (
                    <div style={{ marginTop: '4px', fontSize: '13px' }}>
                      {marineWeather.conditions.warnings.join(' • ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="section">
              <h3 className="section-title">24-Hour Forecast</h3>
              <div className="forecast-container">
                {marineWeather.forecast.slice(0, 12).map((item, index) => (
                  <div key={index} className="forecast-card">
                    <div className="forecast-time">
                      {formatForecastTime(item.time)}
                    </div>
                    <div className="forecast-value">
                      {item.waveHeight.toFixed(1)}m
                    </div>
                    <div className="forecast-label">Waves</div>
                    <div className="forecast-value" style={{ fontSize: '14px', marginTop: '8px' }}>
                      {item.windSpeed.toFixed(0)}
                    </div>
                    <div className="forecast-label">km/h Wind</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tideData && (
          <div className="section">
            <h3 className="section-title">
              <span>🌊</span>
              Tide Information
            </h3>
            <div className="tide-info">
              <div className="tide-current">
                <span>Current Height</span>
                <span className="tide-height">{tideData.currentHeight.toFixed(2)}m</span>
              </div>
              <ul className="tide-list">
                {tideData.tides.map((tide, index) => (
                  <li key={index} className="tide-item">
                    <span>{formatTideTime(tide.time)}</span>
                    <span>
                      <strong>{tide.type === 'high' ? 'High' : 'Low'}</strong>
                      {' '}
                      {tide.height.toFixed(2)}m
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TideBottomSheet;
