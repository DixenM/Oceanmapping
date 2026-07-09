import { formatWindDirection } from '../services/marineWeatherService';
import { formatTideTime } from '../services/tideService';

function StationDetail({ station, marineWeather, tideData, onClose }) {
  if (!station) return null;

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

  const formatForecastTime = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString('da-DK', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'white',
      zIndex: 2000,
      overflowY: 'auto',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="station-header">
          <div>
            <h2>{station.name}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
              {station.lat.toFixed(4)}°N, {station.lon.toFixed(4)}°E
            </p>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {renderConditionBadge()}

        {marineWeather && (
          <>
            <div className="section">
              <h3 className="section-title">
                <span>🌊</span>
                Current Marine Conditions
              </h3>
              
              <div className="current-conditions">
                <div className="condition-card">
                  <div className="condition-label">Wave Height</div>
                  <div className="condition-value">
                    {marineWeather.current.waveHeight.toFixed(2)}
                    <span className="condition-unit">m</span>
                  </div>
                </div>
                
                <div className="condition-card">
                  <div className="condition-label">Wind Wave Height</div>
                  <div className="condition-value">
                    {marineWeather.current.windWaveHeight.toFixed(2)}
                    <span className="condition-unit">m</span>
                  </div>
                </div>
                
                <div className="condition-card">
                  <div className="condition-label">Wind Speed</div>
                  <div className="condition-value">
                    {marineWeather.current.windSpeed.toFixed(1)}
                    <span className="condition-unit">km/h</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Direction: {formatWindDirection(marineWeather.current.windDirection)} ({marineWeather.current.windDirection}°)
                  </div>
                </div>
                
                <div className="condition-card">
                  <div className="condition-label">Wave Direction</div>
                  <div className="condition-value">
                    {marineWeather.current.waveDirection.toFixed(0)}
                    <span className="condition-unit">°</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {formatWindDirection(marineWeather.current.waveDirection)}
                  </div>
                </div>
              </div>

              {marineWeather.conditions && (
                <div style={{ 
                  background: '#f3f4f6', 
                  padding: '16px', 
                  borderRadius: '12px',
                  marginTop: '16px'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    Safety Assessment
                  </h4>
                  <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                    {marineWeather.conditions.message}
                  </p>
                  {marineWeather.conditions.warnings.length > 0 && (
                    <ul style={{ 
                      fontSize: '13px', 
                      color: '#6b7280',
                      paddingLeft: '20px',
                      margin: 0
                    }}>
                      {marineWeather.conditions.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="section">
              <h3 className="section-title">
                <span>📊</span>
                24-Hour Marine Forecast
              </h3>
              <div className="forecast-container">
                {marineWeather.forecast.map((item, index) => (
                  <div key={index} className="forecast-card">
                    <div className="forecast-time">
                      {formatForecastTime(item.time)}
                    </div>
                    <div className="forecast-value">
                      {item.waveHeight.toFixed(1)}m
                    </div>
                    <div className="forecast-label">Wave</div>
                    <div className="forecast-value" style={{ fontSize: '14px', marginTop: '8px' }}>
                      {item.windSpeed.toFixed(0)}
                    </div>
                    <div className="forecast-label">Wind km/h</div>
                    {item.swellWaveHeight > 0 && (
                      <>
                        <div className="forecast-value" style={{ fontSize: '14px', marginTop: '8px' }}>
                          {item.swellWaveHeight.toFixed(1)}m
                        </div>
                        <div className="forecast-label">Swell</div>
                      </>
                    )}
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
              Tide Schedule
            </h3>
            <div className="tide-info">
              <div className="tide-current">
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Current Tide Height</span>
                <span className="tide-height">{tideData.currentHeight.toFixed(2)}m</span>
              </div>
              <ul className="tide-list">
                {tideData.tides.map((tide, index) => (
                  <li key={index} className="tide-item">
                    <span style={{ fontWeight: '500' }}>{formatTideTime(tide.time)}</span>
                    <span>
                      <strong style={{ 
                        color: tide.type === 'high' ? '#3b82f6' : '#ef4444' 
                      }}>
                        {tide.type === 'high' ? 'High Tide' : 'Low Tide'}
                      </strong>
                      {' '}
                      {tide.height.toFixed(2)}m
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#eff6ff',
          borderRadius: '12px',
          fontSize: '13px',
          color: '#1e40af'
        }}>
          <strong>Data Sources:</strong> Marine weather from Open-Meteo Marine API. 
          Tide data is currently simulated for demonstration purposes.
        </div>
      </div>
    </div>
  );
}

export default StationDetail;
